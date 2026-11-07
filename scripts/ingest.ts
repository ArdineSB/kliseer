import { sql } from '../lib/db';
import { ingestSource } from '../lib/ingest';
import { SOURCES } from '../lib/sources';

const ids = process.argv.slice(2);
const picked = ids.length ? SOURCES.filter((s) => ids.includes(s.id)) : SOURCES;
const unknown = ids.filter((id) => !SOURCES.some((s) => s.id === id));
if (unknown.length) { console.error(`unknown source: ${unknown.join(', ')}`); process.exit(1); }

const since = new Date(Date.now() - 365 * 86400_000).toISOString().slice(0, 10);
let failed = false;
for (const src of picked) {
  try {
    const t = Date.now();
    const s = await ingestSource(src, since);
    console.log(`${src.id}: fetched=${s.fetched} kept=${s.kept} inserted=${s.inserted} skippedEmpty=${s.skippedEmpty} (${((Date.now() - t) / 1000).toFixed(0)}s)`);
  } catch (e) {
    failed = true;
    console.error(`${src.id}: ${(e as Error).message}`);
  }
}
await sql.end();
process.exit(failed ? 1 : 0);
