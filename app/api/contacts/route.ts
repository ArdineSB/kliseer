import { cleanContact } from '@/lib/contact-fields';
import { addContact, companyOptions } from '@/lib/contacts';
import { ensureSellerId } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Company picker for the manual contact form: GET /api/contacts?company=<query>. */
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get('company') ?? '';
  if (q.length < 2 || q.length > 100) return Response.json([]);
  return Response.json(await companyOptions(q));
}

export async function POST(req: Request) {
  const clean = cleanContact(await req.json().catch(() => null));
  if (!clean.ok) return Response.json({ error: clean.error }, { status: 400 });
  const contact = await addContact(await ensureSellerId(), clean.value);
  return contact ? Response.json(contact, { status: 201 }) : Response.json({ error: 'Company not found.' }, { status: 404 });
}
