import { sql } from './db';
import { keywordRegexPg } from './tier';
import type { FieldValue } from './fields';

export type Component = 'keyword' | 'freshness' | 'place' | 'targetFit';
export const COMPONENTS: Component[] = ['keyword', 'freshness', 'place', 'targetFit'];

export type Stars = { keyword: number; freshness: number; place: number; targetFit: number };

/** Each component 0-5, overall = sum 0-20. Deterministic; no LLM. */
export function stars({ recentMatched, lastSignalDays, state, name, summary, sellerRegion, targetRegions, targetCompanyTypes }: {
  recentMatched: number; lastSignalDays: number | null; state: string; name: string; summary: string;
  sellerRegion: string[]; targetRegions: string[]; targetCompanyTypes: string[];
}): Stars {
  const keyword = Math.min(recentMatched, 5);
  const freshness = lastSignalDays === null ? 0 : lastSignalDays <= 30 ? 5 : lastSignalDays <= 90 ? 4 : lastSignalDays <= 180 ? 3 : lastSignalDays <= 270 ? 2 : lastSignalDays <= 365 ? 1 : 0;
  const place = sellerRegion.includes(state) ? 5 : targetRegions.includes(state) ? 3 : 0;
  const hay = `${name} ${summary}`.toLowerCase();
  const targetFit = targetCompanyTypes.some((t) => t.trim() && hay.includes(t.trim().toLowerCase())) ? 5 : 1;
  return { keyword, freshness, place, targetFit };
}

export function overall(s: Stars): number {
  return s.keyword + s.freshness + s.place + s.targetFit;
}

export type Tier = 'S' | 'A' | 'B' | 'C' | '—';
export function tierFromScore(score: number): Tier {
  if (score >= 16) return 'S';
  if (score >= 12) return 'A';
  if (score >= 8) return 'B';
  if (score >= 4) return 'C';
  return '—';
}

export function sectionText(data: Record<string, FieldValue> | null | undefined): string[] {
  if (!data) return [];
  const out: string[] = [];
  for (const v of Object.values(data)) {
    if (Array.isArray(v)) out.push(...v.filter((i) => i.trim()));
    else if (v.trim()) out.push(v);
  }
  return out;
}

/** Materialize stars, score, tier for every company. Caller: ingest cron and scripts/score-refresh.ts. */
export async function refreshScores(): Promise<number> {
  const [seller] = await sql<{ company: Record<string, unknown>; target: Record<string, unknown> }[]>`select company, target from sellers where id = 1`;
  if (!seller) throw new Error('seller 1 missing');
  const re = keywordRegexPg((seller.company.keywords as string[] | undefined) ?? []);
  if (!re) throw new Error('seller 1 has no keywords');
  const sellerRegion = (seller.company.region as string[] | undefined) ?? [];
  const targetRegions = ((seller.target.regions as string[] | undefined) ?? []).map((r) => r.trim().toUpperCase());
  const pattern = ((seller.target.companyTypes as string[] | undefined) ?? [])
    .flatMap((t) => String(t).split(/[,\n]/)).map((t) => t.trim()).filter(Boolean)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').toLowerCase()).join('|');
  const computed = sql`
    select c.id as company_id,
      greatest(0, least(5, coalesce(a.recent_matched, 0))) as k,
      (case when a.last_days is null then 0 when a.last_days <= 30 then 5 when a.last_days <= 90 then 4 when a.last_days <= 180 then 3 when a.last_days <= 270 then 2 when a.last_days <= 365 then 1 else 0 end) as f,
      (case when c.state = any(${sellerRegion}) then 5 when upper(c.state) = any(${targetRegions}) then 3 else 0 end) as p,
      (case when ${pattern ? sql`lower(c.name || ' ' || coalesce(a.last_summary, '')) ~ (${pattern})` : sql`false`} then 5 else 1 end) as t
    from companies c
    left join (
      select company_id,
        count(*) filter (where signal_date >= current_date - 90 and summary ~* ${re})::int as recent_matched,
        current_date - max(signal_date) as last_days,
        (array_agg(summary order by signal_date desc, id desc))[1] as last_summary
      from signals where signal_date >= current_date - 365 group by company_id
    ) a on a.company_id = c.id`;
  const scored = await sql`
    with s as (${computed})
    update companies c set
      keyword_stars = s.k, freshness_stars = s.f, place_stars = s.p, target_fit_stars = s.t,
      score = s.k + s.f + s.p + s.t,
      tier = case
        when s.k + s.f + s.p + s.t >= 16 then 'S'
        when s.k + s.f + s.p + s.t >= 12 then 'A'
        when s.k + s.f + s.p + s.t >= 8 then 'B'
        when s.k + s.f + s.p + s.t >= 4 then 'C'
        else '—' end
    from s where c.id = s.company_id returning c.id`;
  return scored.count;
}

export const TIER_ORDER: Record<Tier, number> = { S: 0, A: 1, B: 2, C: 3, '—': 4 };
