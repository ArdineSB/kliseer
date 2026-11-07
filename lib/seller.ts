import { sql, SELLER_ID } from './db';
import type { FieldValue, Section, Seller, Status } from './fields';

export async function getSeller(): Promise<Seller> {
  const [s] = await sql<Seller[]>`select id, company, icp, target, status, sources from sellers where id = ${SELLER_ID}`;
  if (!s) throw new Error('Seller 1 missing. Run npm run db:init.');
  return s;
}

/**
 * Merge validated fields into a section. Any edit resets the section to draft unless approving.
 * sourceMsgId set = values came from chat ("From chat" marker); unset = manual edit, marker dropped.
 */
export async function saveSection(section: Section, data: Record<string, FieldValue>, approve: boolean, sourceMsgId?: number) {
  const status: Status = approve ? 'approved' : 'draft';
  const keys = Object.keys(data).map((k) => `${section}.${k}`);
  const srcPatch = sourceMsgId ? Object.fromEntries(keys.map((k) => [k, sourceMsgId])) : {};
  const [s] = await sql<Seller[]>`
    update sellers set
      ${sql(section)} = ${sql(section)} || ${sql.json(data)},
      status = jsonb_set(status, ${[section]}, ${sql.json(status)}),
      sources = (sources - ${sourceMsgId ? [] : keys}::text[]) || ${sql.json(srcPatch)},
      updated_at = now()
    where id = ${SELLER_ID}
    returning id, company, icp, target, status, sources`;
  return s;
}
