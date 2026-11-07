import { sql } from './db';
import { getSeller } from './seller';
import { SOURCES } from './sources';
import { keywordRegexPg, matchKeywords, RECENT_DAYS, tierFromCounts, TIER_ORDER, YEAR_DAYS, type Tier } from './tier';

export type Prospect = {
  id: number; name: string; state: string; tier: Tier; outsideRegion: boolean;
  signals: number; recent: number; matched: number; lastDate: string; firstDate: string; lastSummary: string; sources: string[];
};
export type ProspectFilter = { q?: string; tier?: string; source?: string; page?: number };
export const PAGE_SIZE = 50;

const sourceLabel = (id: string) => SOURCES.find((source) => source.id === id)?.label ?? id;

/**
 * Per-company counts are aggregated in Postgres (≈200k signals; loading rows into the app is too slow).
 * Tier rule lives in lib/tier.ts; SQL only supplies the counts it needs.
 * ponytail: per-request aggregate (~1s at 200k rows). Move to a materialized view refreshed after ingest if it gets slow.
 */
export async function listProspects(f: ProspectFilter) {
  const seller = await getSeller();
  const keywords = (seller.company.keywords as string[] | undefined) ?? [];
  const region = (seller.company.region as string[] | undefined) ?? [];
  const re = keywordRegexPg(keywords);
  const q = f.q?.trim() ? `%${f.q.trim().replace(/[\\%_]/g, '\\$&')}%` : null;
  const src = f.source && SOURCES.some((s) => s.id === f.source) ? f.source : null;

  const rows = await sql<{ id: number; name: string; state: string; signals: number; recent: number; recent_matched: number; matched: number; last_date: string; last_summary: string; sources: string[]; first_date: string }[]>`
    select c.id, c.name, c.state,
      count(*)::int as signals,
      count(*) filter (where s.signal_date >= current_date - ${RECENT_DAYS}::int)::int as recent,
      count(*) filter (where s.signal_date >= current_date - ${RECENT_DAYS}::int and ${re}::text is not null and s.summary ~* ${re ?? ''})::int as recent_matched,
      count(*) filter (where ${re}::text is not null and s.summary ~* ${re ?? ''})::int as matched,
      max(s.signal_date)::text as last_date,
      min(s.signal_date)::text as first_date,
      (array_agg(s.summary order by s.signal_date desc, s.id desc))[1] as last_summary,
      array_agg(distinct s.source) as sources
    from companies c join signals s on s.company_id = c.id
    where s.signal_date >= current_date - ${YEAR_DAYS}::int
      ${src ? sql`and s.source = ${src}` : sql``}
      ${q ? sql`and c.name ilike ${q}` : sql``}
    group by c.id`;

  const all: Prospect[] = rows.map((r) => ({
    id: r.id, name: r.name, state: r.state,
    tier: tierFromCounts({ recent: r.recent, recentMatched: r.recent_matched, year: r.signals }),
    outsideRegion: !region.includes(r.state),
    signals: r.signals, recent: r.recent, matched: r.matched,
    lastDate: r.last_date, lastSummary: r.last_summary, sources: r.sources.map(sourceLabel), firstDate: r.first_date,
  }));
  all.sort((a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier] || b.matched - a.matched || b.lastDate.localeCompare(a.lastDate));

  const weekAgo = new Date(Date.now() - 7 * 86400_000).toISOString().slice(0, 10);
  const summary = { total: all.length, tierS: all.filter((p) => p.tier === 'S').length, new: all.filter((p) => p.firstDate >= weekAgo).length };
  const filtered = f.tier ? all.filter((p) => p.tier === f.tier) : all;
  const page = Math.max(1, f.page ?? 1);
  const items = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return { summary, filteredTotal: filtered.length, page, pageSize: PAGE_SIZE, items };
}

export type ProspectDetail = {
  id: number; name: string; state: string; tier: Tier; outsideRegion: boolean; totalSignals: number;
  signals: { id: number; date: string; source: string; summary: string; region: string | null; url: string; matched: string[] }[];
};

export async function getProspect(id: number): Promise<ProspectDetail | null> {
  const [c] = await sql<{ id: number; name: string; state: string }[]>`select id, name, state from companies where id = ${id}`;
  if (!c) return null;
  const seller = await getSeller();
  const keywords = (seller.company.keywords as string[] | undefined) ?? [];
  const region = (seller.company.region as string[] | undefined) ?? [];
  const re = keywordRegexPg(keywords);
  const [counts] = await sql<{ total: number; recent: number; recent_matched: number; year: number }[]>`
    select count(*)::int as total,
      count(*) filter (where signal_date >= current_date - ${RECENT_DAYS}::int)::int as recent,
      count(*) filter (where signal_date >= current_date - ${RECENT_DAYS}::int and ${re}::text is not null and summary ~* ${re ?? ''})::int as recent_matched,
      count(*) filter (where signal_date >= current_date - ${YEAR_DAYS}::int)::int as year
    from signals where company_id = ${id}`;
  const rows = await sql<{ id: number; date: string; source: string; summary: string; region: string | null; url: string }[]>`
    select id, signal_date::text as date, source, summary, region, source_url as url
    from signals where company_id = ${id} order by signal_date desc, id desc limit 200`;
  const signals = rows.map((r) => ({ ...r, source: sourceLabel(r.source), matched: matchKeywords(r.summary, keywords) }));
  return { ...c, tier: tierFromCounts({ recent: counts.recent, recentMatched: counts.recent_matched, year: counts.year }), outsideRegion: !region.includes(c.state), totalSignals: counts.total, signals };
}

export async function recentSignals(limit = 100) {
  const rows = await sql<{ id: number; date: string; source: string; summary: string; url: string; company_id: number; company: string }[]>`
    select s.id, s.signal_date::text as date, s.source, s.summary, s.source_url as url, c.id as company_id, c.name as company
    from signals s join companies c on c.id = s.company_id
    order by s.signal_date desc, s.id desc limit ${limit}`;
  return rows.map((r) => ({ ...r, source: sourceLabel(r.source) }));
}
