import type { Contact, ContactInput } from './contact-fields';
import { sql } from './db';

type Row = { id: number; company_id: number; company: string; name: string; title: string | null; email: string | null; phone: string | null; linkedin_url: string | null; website: string | null; social_url: string | null; source_url: string; seller_id: number | null };
const map = (r: Row): Contact => ({
  id: r.id, companyId: r.company_id, company: r.company, name: r.name, title: r.title, email: r.email, phone: r.phone,
  linkedinUrl: r.linkedin_url, website: r.website, socialUrl: r.social_url, sourceUrl: r.source_url, manual: r.seller_id !== null,
});

/** Seed rows (seller_id null) are shared; manual rows are visible only to their seller. */
export async function listContacts(sellerId: number, f: { companyId?: number; q?: string; limit?: number; offset?: number } = {}) {
  const q = f.q?.trim() ? `%${f.q.trim().replace(/[\\%_]/g, '\\$&')}%` : null;
  const where = sql`(k.seller_id is null or k.seller_id = ${sellerId})
    ${f.companyId ? sql`and k.company_id = ${f.companyId}` : sql``}
    ${q ? sql`and (k.name ilike ${q} or c.name ilike ${q} or k.email ilike ${q} or k.title ilike ${q})` : sql``}`;
  const [rows, [{ total }]] = await Promise.all([
    sql<Row[]>`select k.*, c.name as company from contacts k join companies c on c.id = k.company_id where ${where}
      order by k.company_id, k.id limit ${f.limit ?? 200} offset ${f.offset ?? 0}`,
    sql<{ total: number }[]>`select count(*)::int as total from contacts k join companies c on c.id = k.company_id where ${where}`,
  ]);
  return { items: rows.map(map), total };
}

export async function addContact(sellerId: number, c: ContactInput): Promise<Contact | null> {
  const [row] = await sql<Row[]>`
    with ins as (
      insert into contacts (company_id, seller_id, name, title, email, phone, linkedin_url, website, social_url, source_url)
      select ${c.companyId}, ${sellerId}, ${c.name}, ${c.title}, ${c.email}, ${c.phone}, ${c.linkedinUrl}, ${c.website}, ${c.socialUrl}, ${c.sourceUrl}
      where exists (select 1 from companies where id = ${c.companyId})
      returning *)
    select ins.*, c.name as company from ins join companies c on c.id = ins.company_id`;
  return row ? map(row) : null;
}

/** Only the owner can delete a manual contact; seed rows are never deletable here. */
export async function deleteContact(sellerId: number, id: number): Promise<boolean> {
  const r = await sql`delete from contacts where id = ${id} and seller_id = ${sellerId}`;
  return r.count > 0;
}

export async function companyOptions(q: string) {
  const like = `%${q.trim().replace(/[\\%_]/g, '\\$&')}%`;
  return sql<{ id: number; name: string; state: string }[]>`
    select id, name, state from companies where name ilike ${like} order by score desc nulls last, name limit 20`;
}
