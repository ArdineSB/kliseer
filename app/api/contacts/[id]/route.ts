import { deleteContact } from '@/lib/contacts';
import { ensureSellerId } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function DELETE(_req: Request, ctx: RouteContext<'/api/contacts/[id]'>) {
  const id = Number((await ctx.params).id);
  if (!Number.isInteger(id) || id <= 0) return Response.json({ error: 'invalid id' }, { status: 400 });
  const ok = await deleteContact(await ensureSellerId(), id);
  return ok ? new Response(null, { status: 204 }) : Response.json({ error: 'not found' }, { status: 404 });
}
