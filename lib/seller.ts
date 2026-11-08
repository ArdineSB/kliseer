import { GUEST_DEMO_SELLER } from './session';
import { sql } from './db';
import type { FieldValue, Section, Seller, Status } from './fields';

export async function getSeller(id: number): Promise<Seller> {
  const [s] = await sql<Seller[]>`select id, company, icp, target, status, sources from sellers where id = ${id}`;
  if (!s) throw new Error(`Seller ${id} missing.`);
  return s;
}

/** Copy the read-only Harborline case-study profile into a blank guest workspace. */
export async function loadGuestDemo(sellerId: number): Promise<Seller | null> {
  const [seller] = await sql<Seller[]>`
    update sellers guest set
      company = demo.company,
      icp = demo.icp,
      target = demo.target,
      status = '{"company":"draft","icp":"draft","target":"draft"}'::jsonb,
      sources = '{}'::jsonb,
      updated_at = now()
    from sellers demo
    where guest.id = ${sellerId}
      and guest.user_id is null
      and guest.guest_token_hash is not null
      and guest.company = '{}'::jsonb and guest.icp = '{}'::jsonb and guest.target = '{}'::jsonb
      and demo.id = ${GUEST_DEMO_SELLER}
    returning guest.id, guest.company, guest.icp, guest.target, guest.status, guest.sources`;
  return seller ?? null;
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
