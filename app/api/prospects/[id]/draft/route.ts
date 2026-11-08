import { sql } from '@/lib/db';
import { LlmUnavailable } from '@/lib/chat';
import { generateDraft, saveDraft } from '@/lib/draft';
import { getProspect } from '@/lib/prospects';
import { ensureSellerId } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = RouteContext<'/api/prospects/[id]/draft'>;

export async function POST(req: Request, ctx: Ctx) {
  const id = Number((await ctx.params).id);
  if (!Number.isInteger(id) || id <= 0) return Response.json({ error: 'invalid id' }, { status: 400 });
  const body = (await req.json().catch(() => ({}))) as { contactId?: unknown };
  if (typeof body.contactId !== 'number' || !Number.isInteger(body.contactId)) return Response.json({ error: 'contactId required' }, { status: 400 });
  const sellerId = await ensureSellerId();
  const [contact] = await sql<{ name: string; email: string | null }[]>`
    select name, email from contacts where id = ${body.contactId} and company_id = ${id} and (seller_id is null or seller_id = ${sellerId})`;
  if (!contact) return Response.json({ error: 'contact not found' }, { status: 404 });
  const p = await getProspect(sellerId, id);
  if (!p) return Response.json({ error: 'not found' }, { status: 404 });
  const [sellerRow] = await sql<{ company: Record<string, unknown> }[]>`select company from sellers where id = ${sellerId}`;
  try {
    const draft = await generateDraft(sellerId, id, contact, {
      company: p.name,
      state: p.state,
      stars: p.stars,
      lastSignals: p.signals.slice(0, 5).map((s) => ({ date: s.date, summary: s.summary })),
      seller: { name: String(sellerRow?.company.name ?? ''), products: (sellerRow?.company.products as string | string[] | undefined) ?? '' },
    });
    return Response.json(draft);
  } catch (e) {
    if (e instanceof LlmUnavailable) return Response.json({ error: 'LLM unavailable' }, { status: 502 });
    throw e;
  }
}

export async function PUT(req: Request, ctx: Ctx) {
  const id = Number((await ctx.params).id);
  if (!Number.isInteger(id) || id <= 0) return Response.json({ error: 'invalid id' }, { status: 400 });
  const body = (await req.json().catch(() => ({}))) as { subject?: unknown; body?: unknown };
  if (typeof body.subject !== 'string' || typeof body.body !== 'string') return Response.json({ error: 'subject and body required' }, { status: 400 });
  if (body.subject.length > 200 || body.body.length > 4000) return Response.json({ error: 'too long' }, { status: 400 });
  const sellerId = await ensureSellerId();
  await saveDraft(sellerId, id, body.subject, body.body);
  return Response.json({ ok: true });
}
