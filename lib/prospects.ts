import { sql } from './db';
import { getSeller } from './seller';
import { SOURCES } from './sources';
import { keywordRegexPg, matchKeywords, RECENT_DAYS, TIER_ORDER, YEAR_DAYS, tierFromCounts, type Tier } from './tier';

export type Prospect = {
  id: number; name: string; state: string; tier: Tier; score: number | null;
  keyword: number | null; freshness: number | null; place: number | null; targetFit: number | null;
  signals: number; recent: number; matched: number; lastDate: string; firstDate: string; lastSummary: string; sources: string[];
};
export type ProspectFilter = { q?: string; tier?: string; source?: string; page?: number };
/** Seer default shows top 20; the rest is behind the upgrade gate (Q6, UI-only). */
export const TOP = 20;
export const PAGE_SIZE = 50;

const sourceLabel = (id: string) => SOURCES.find((source) => source.id === id)?.label ?? id;

/**
 * Reads materialized score columns (refreshed by ingest cron, Q14). Falls back to
 * tierFromCounts when the materialization has not run yet, so Seer never shows blanks.
 */
export async function listProspects(sellerId: number, f: ProspectFilter) {
  const seller = await getSeller(sellerId);
  const keywords = (seller.company.keywords as string[] | undefined) ?? [];
  const re = keywordRegexPg(keywords);
  const q = f.q?.trim() ? `%${f.q.trim().replace(/[\\%_]/g, '\\$&')}%` : null;
  const src = f.source && SOURCES.some((s) => s.id === f.source) ? f.source : null;

  const rows = await sql<{ id: number; name: string; state: string; signals: number; recent: number; recent_matched: number; matched: number; last_date: string; last_summary: string; sources: string[]; first_date: string; tier: string | null; score: number | null; keyword: number | null; freshness: number | null; place: number | null; target_fit: number | null }[]>`
    select c.id, c.name, c.state,
      count(*)::int as signals,
      count(*) filter (where s.signal_date >= current_date - ${RECENT_DAYS}::int)::int as recent,
      count(*) filter (where s.signal_date >= current_date - ${RECENT_DAYS}::int and ${re ? sql`s.summary ~* ${re}` : sql`false`})::int as recent_matched,
      count(*) filter (where ${re ? sql`s.summary ~* ${re}` : sql`false`})::int as matched,
      max(s.signal_date)::text as last_date,
      min(s.signal_date)::text as first_date,
      (array_agg(s.summary order by s.signal_date desc, s.id desc))[1] as last_summary,
      array_agg(distinct s.source) as sources,
      c.tier, c.score, c.keyword_stars as keyword, c.freshness_stars as freshness, c.place_stars as place, c.target_fit_stars as target_fit
    from companies c join signals s on s.company_id = c.id
    where s.signal_date >= current_date - ${YEAR_DAYS}::int
      ${src ? sql`and s.source = ${src}` : sql``}
      ${q ? sql`and c.name ilike ${q}` : sql``}
    group by c.id, c.name, c.state, c.tier, c.score, c.keyword_stars, c.freshness_stars, c.place_stars, c.target_fit_stars`;

  const all: Prospect[] = rows.map((r) => ({
    id: r.id, name: r.name, state: r.state,
    tier: (r.tier as Tier | null) ?? tierFromCounts({ recent: r.recent, recentMatched: r.recent_matched, year: r.signals }),
    score: r.score,
    keyword: r.keyword, freshness: r.freshness, place: r.place, targetFit: r.target_fit,
    signals: r.signals, recent: r.recent, matched: r.matched,
    lastDate: r.last_date, lastSummary: r.last_summary, sources: r.sources.map(sourceLabel), firstDate: r.first_date,
  }));
  all.sort((a, b) => (b.score ?? -1) - (a.score ?? -1) || TIER_ORDER[a.tier] - TIER_ORDER[b.tier] || b.matched - a.matched || b.lastDate.localeCompare(a.lastDate));

  const weekAgo = new Date(Date.now() - 7 * 86400_000).toISOString().slice(0, 10);
  const summary = { total: all.length, tierS: all.filter((p) => p.tier === 'S').length, new: all.filter((p) => p.firstDate >= weekAgo).length };
  const filtered = f.tier ? all.filter((p) => p.tier === f.tier) : all;
  const page = Math.max(1, f.page ?? 1);
  const items = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return { summary, filteredTotal: filtered.length, page, pageSize: PAGE_SIZE, items };
}

export type ProspectDetail = {
  id: number; name: string; state: string; tier: Tier; outsideRegion: boolean; totalSignals: number;
  score: number | null;
  stars: { keyword: number | null; freshness: number | null; place: number | null; targetFit: number | null };
  contacts: { id: number; name: string; title: string | null; email: string | null; phone: string | null; website: string | null; sourceUrl: string }[];
  draft: { subject: string; body: string } | null;
  signals: { id: number; date: string; source: string; summary: string; region: string | null; url: string; matched: string[] }[];
};

export async function getProspect(sellerId: number, id: number): Promise<ProspectDetail | null> {
  const [c] = await sql<{ id: number; name: string; state: string; tier: string | null; score: number | null; keyword_stars: number | null; freshness_stars: number | null; place_stars: number | null; target_fit_stars: number | null }[]>`
    select id, name, state, tier, score, keyword_stars, freshness_stars, place_stars, target_fit_stars from companies where id = ${id}`;
  if (!c) return null;
  const seller = await getSeller(sellerId);
  const keywords = (seller.company.keywords as string[] | undefined) ?? [];
  const region = (seller.company.region as string[] | undefined) ?? [];
  const re = keywordRegexPg(keywords);
  const [counts] = await sql<{ total: number; recent: number; recent_matched: number; year: number }[]>`
    select count(*)::int as total,
      count(*) filter (where signal_date >= current_date - ${RECENT_DAYS}::int)::int as recent,
      count(*) filter (where signal_date >= current_date - ${RECENT_DAYS}::int and ${re ? sql`summary ~* ${re}` : sql`false`})::int as recent_matched,
      count(*) filter (where signal_date >= current_date - ${YEAR_DAYS}::int)::int as year
    from signals where company_id = ${id}`;
  const rows = await sql<{ id: number; date: string; source: string; summary: string; region: string | null; url: string }[]>`
    select id, signal_date::text as date, source, summary, region, source_url as url
    from signals where company_id = ${id} order by signal_date desc, id desc limit 200`;
  const contacts = await sql<{ id: number; name: string; title: string | null; email: string | null; phone: string | null; website: string | null; source_url: string }[]>`
    select id, name, title, email, phone, website, source_url from contacts where company_id = ${id} order by id`;
  const [draft] = await sql<{ subject: string; body: string }[]>`
    select subject, body from email_drafts where seller_id = ${sellerId} and company_id = ${id}`;
  const signals = rows.map((r) => ({ ...r, source: sourceLabel(r.source), matched: matchKeywords(r.summary, keywords) }));
  return {
    ...c, tier: (c.tier as Tier | null) ?? tierFromCounts({ recent: counts.recent, recentMatched: counts.recent_matched, year: counts.year }),
    outsideRegion: !region.includes(c.state), totalSignals: counts.total,
    score: c.score,
    stars: { keyword: c.keyword_stars, freshness: c.freshness_stars, place: c.place_stars, targetFit: c.target_fit_stars },
    contacts: contacts.map((k) => ({ id: k.id, name: k.name, title: k.title, email: k.email, phone: k.phone, website: k.website, sourceUrl: k.source_url })),
    draft: draft ?? null,
    signals,
  };
}

export async function recentSignals(limit = 100) {
  const rows = await sql<{ id: number; date: string; source: string; summary: string; url: string; company_id: number; company: string }[]>`
    select s.id, s.signal_date::text as date, s.source, s.summary, s.source_url as url, c.id as company_id, c.name as company
    from signals s join companies c on s.company_id = c.id
    order by s.signal_date desc, s.id desc limit ${limit}`;
  return rows.map((r) => ({ ...r, source: sourceLabel(r.source) }));
}
