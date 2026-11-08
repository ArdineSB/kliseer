import { addContact, listContacts } from '@/lib/contacts';
import { lookupContacts, LOOKUP_LIMIT } from '@/lib/lookup';
import { sql } from '@/lib/db';
import { getViewer } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Monthly lookup quota per seller (Q12 design: login required, Free 5/month). */
async function quota(sellerId: number) {
  const [{ used }] = await sql<{ used: number }[]>`
    select count(*)::int as used from contact_lookups
    where seller_id = ${sellerId} and created_at >= date_trunc('month', now())`;
  return { used, left: LOOKUP_LIMIT - used };
}

/** GET /api/prospects/[id]/lookup → quota for this month. */
export async function GET() {
  const viewer = await getViewer();
  if (!viewer?.loggedIn) return Response.json({ error: 'Log in to use contact search.' }, { status: 401 });
  return Response.json(await quota(viewer.sellerId));
}

export async function POST(_req: Request, ctx: RouteContext<'/api/prospects/[id]/lookup'>) {
  const viewer = await getViewer();
  if (!viewer?.loggedIn) return Response.json({ error: 'Log in to use contact search.' }, { status: 401 });
  const id = Number((await ctx.params).id);
  if (!Number.isInteger(id) || id <= 0) return Response.json({ error: 'invalid id' }, { status: 400 });
  const [c] = await sql<{ name: string; state: string }[]>`select name, state from companies where id = ${id}`;
  if (!c) return Response.json({ error: 'not found' }, { status: 404 });

  const q = await quota(viewer.sellerId);
  if (q.left <= 0) return Response.json({ error: `Monthly limit reached (${LOOKUP_LIMIT} lookups). Try again next month.` }, { status: 429 });

  let found = 0;
  let note: string;
  try {
    const r = await lookupContacts(c.name, c.state);
    note = r.note;
    for (const input of r.contacts) {
      const saved = await addContact(viewer.sellerId, { ...input, companyId: id });
      if (saved) found++;
    }
  } catch {
    found = 0;
    note = 'Contact search is unavailable right now. Try again.';
  }
  // A lookup that found nothing still spends quota: the search itself is the cost.
  await sql`insert into contact_lookups (seller_id, company_id, found) values (${viewer.sellerId}, ${id}, ${found})`;
  const { items } = await listContacts(viewer.sellerId, { companyId: id });
  const after = await quota(viewer.sellerId);
  return Response.json({ found, note, contacts: items, quota: after });
}
