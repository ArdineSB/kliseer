export type Tier = 'S' | 'A' | 'B' | 'C' | '—';
export const RECENT_DAYS = 90;
export const YEAR_DAYS = 365;
/** recent = signals ≤ RECENT_DAYS old, recentMatched = recent with ≥1 keyword, year = signals ≤ YEAR_DAYS old. */
export type TierCounts = { recent: number; recentMatched: number; year: number };

const esc = (k: string) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Seller keywords found in a signal summary (case-insensitive, word boundary). */
export function matchKeywords(summary: string, keywords: string[]): string[] {
  return keywords.filter((k) => k.trim() && new RegExp(`\\b${esc(k.trim())}\\b`, 'i').test(summary));
}

/** Same keywords as one Postgres regex (`~*`), `\m`/`\M` = word boundaries. Null when no keywords. */
export function keywordRegexPg(keywords: string[]): string | null {
  const ks = keywords.map((k) => k.trim()).filter(Boolean).map(esc);
  return ks.length ? `\\m(${ks.join('|')})\\M` : null;
}

export function tierFromCounts({ recent, recentMatched, year }: TierCounts): Tier {
  if (recent >= 2 && recentMatched >= 1) return 'S';
  if (recent === 1 && recentMatched === 1) return 'A';
  if (recent >= 1) return 'B';
  return year > 0 ? 'C' : '—';
}

/** Tier for one company's signals; `today` compared as UTC dates, windows inclusive. */
export function tierFor(signals: { date: string; matched: string[] }[], today: Date): Tier {
  const t0 = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const ages = signals.map((s) => ({ age: (t0 - Date.parse(s.date.slice(0, 10))) / 86400_000, hit: s.matched.length > 0 }));
  const recent = ages.filter((a) => a.age <= RECENT_DAYS);
  return tierFromCounts({
    recent: recent.length,
    recentMatched: recent.filter((a) => a.hit).length,
    year: ages.filter((a) => a.age <= YEAR_DAYS).length,
  });
}

export const TIER_ORDER: Record<Tier, number> = { S: 0, A: 1, B: 2, C: 3, '—': 4 };
