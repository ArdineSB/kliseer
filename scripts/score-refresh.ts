import { sql } from '../lib/db';
import { refreshScores } from '../lib/score';

const t = Date.now();
const n = await refreshScores();
console.log(`updated=${n} (${((Date.now() - t) / 1000).toFixed(0)}s)`);
const rows = await sql<{ name: string; score: number; tier: string; k: number; f: number; p: number; t: number }[]>`
  select name, score, tier, keyword_stars k, freshness_stars f, place_stars p, target_fit_stars t
  from companies where score is not null order by score desc limit 5`;
for (const r of rows) console.log(`${r.tier} ${r.score} ${r.name} k=${r.k} f=${r.f} p=${r.p} t=${r.t}`);
const [n2] = await sql<{ n: number; s: number }[]>`
  select count(*)::int as n, count(*) filter (where tier = 'S')::int as s from companies where score is not null`;
console.log(`scored=${n2.n} tierS=${n2.s}`);
await sql.end();
