import { setTimeout as sleep } from 'node:timers/promises';
import { sql } from './db';
import { normalizeName, sourceUrl, type Mapped, type SodaSource } from './sources';

const PAGE = 5000;

/** GET with retry on 5xx/network errors (SODA drops long pulls). 4xx fails fast. */
async function getJson(url: string, headers: Record<string, string>, id: string) {
  for (let attempt = 1; ; attempt++) {
    // "terminated" from a dropped body happens in res.json(), so retry covers both fetch and read.
    const res = await fetch(url, { headers, signal: AbortSignal.timeout(120_000) }).catch((e: Error) => e);
    if (res instanceof Response && res.ok) {
      const rows = await res.json().catch((e: Error) => e);
      if (Array.isArray(rows)) return rows as Record<string, unknown>[];
      if (attempt >= 5) throw new Error(`${id}: ${rows instanceof Error ? rows.message : 'non-array body'} ${url.split('?')[0]}`);
      await sleep(2000 * 2 ** attempt);
      continue;
    }
    const why = res instanceof Response ? `HTTP ${res.status}` : res.message;
    if ((res instanceof Response && res.status < 500) || attempt >= 5) throw new Error(`${id}: ${why} ${url.split('?')[0]}`);
    await sleep(2000 * 2 ** attempt);
  }
}

export async function ingestSource(src: SodaSource, sinceISO: string) {
  const stats = { fetched: 0, kept: 0, inserted: 0, skippedEmpty: 0 };
  const headers: Record<string, string> = {};
  if (process.env.SODA_APP_TOKEN) headers['X-App-Token'] = process.env.SODA_APP_TOKEN;

  // Resume from the newest stored date; overlap is absorbed by the unique key.
  const [{ last }] = await sql<{ last: string | null }[]>`select max(signal_date)::text as last from signals where source = ${src.id}`;
  const since = last && last > sinceISO ? last : sinceISO;

  for (let offset = 0; ; offset += PAGE) {
    const where = `${src.dateField} >= '${since}'${src.where ? ` AND ${src.where}` : ''}`;
    const qs = new URLSearchParams({ $where: where, $order: `${src.dateField}, :id`, $limit: String(PAGE), $offset: String(offset) });
    const rows = await getJson(`${src.endpoint}?${qs}`, headers, src.id);
    stats.fetched += rows.length;

    // Map, drop empties, dedupe by record id inside the page.
    const byId = new Map<string, { m: Mapped; raw: Record<string, unknown>; key: string }>();
    for (const raw of rows) {
      const m = src.map(raw);
      const key = m.companyName ? normalizeName(m.companyName) : '';
      if (!m.companyName || !key || !m.date || !m.recordId) { stats.skippedEmpty++; continue; }
      byId.set(m.recordId, { m, raw, key });
    }
    const kept = [...byId.values()];
    stats.kept += kept.length;

    if (kept.length) {
      const companies = [...new Map(kept.map((k) => [k.key, { name: k.m.companyName!, name_key: k.key, state: src.state }])).values()];
      // "do update" (no-op) so returning yields ids for existing rows too.
      const ids = await sql<{ id: number; name_key: string }[]>`
        insert into companies ${sql(companies)}
        on conflict (name_key) do update set name_key = excluded.name_key
        returning id, name_key`;
      const idOf = new Map(ids.map((r) => [r.name_key, r.id]));

      const signals = kept.map((k) => ({
        company_id: idOf.get(k.key)!,
        source: src.id,
        source_record_id: k.m.recordId!,
        signal_date: k.m.date!.slice(0, 10),
        summary: k.m.summary || '(no description)',
        region: k.m.region,
        source_url: sourceUrl(src, k.m.recordId!),
        raw: sql.json(k.raw as never),
      }));
      const ins = await sql`insert into signals ${sql(signals)} on conflict (source, source_record_id) do nothing returning id`;
      stats.inserted += ins.count;
    }
    if (rows.length < PAGE) break;
  }
  return stats;
}
