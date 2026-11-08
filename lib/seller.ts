import { sql } from './db';
import type { FieldValue, Section, Seller, Status } from './fields';

export async function getSeller(id: number): Promise<Seller> {
  const [s] = await sql<Seller[]>`select id, company, icp, target, status, sources from sellers where id = ${id}`;
  if (!s) throw new Error(`Seller ${id} missing.`);
  return s;
}

/**
 * Merge validated fields into a section. Any edit resets the section to draft unless approving.
 * sourceMsgId set = values came from chat ("From chat" marker); unset = manual edit, marker dropped.
 */
export async function saveSection(id: number, section: Section, data: Record<string, FieldValue>, approve: boolean, sourceMsgId?: number) {
  const status: Status = approve ? 'approved' : 'draft';
  const keys = Object.keys(data).map((k) => `${section}.${k}`);
  const srcPatch = sourceMsgId ? Object.fromEntries(keys.map((k) => [k, sourceMsgId])) : {};
  const [s] = await sql<Seller[]>`
    update sellers set
      ${sql(section)} = ${sql(section)} || ${sql.json(data)},
      status = jsonb_set(status, ${[section]}, ${sql.json(status)}),
      sources = (sources - ${sourceMsgId ? [] : keys}::text[]) || ${sql.json(srcPatch)},
      updated_at = now()
    where id = ${id}
    returning id, company, icp, target, status, sources`;
  return s;
}
