import { getProspect } from '@/lib/prospects';
import { ensureSellerId } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: Request, ctx: RouteContext<'/api/prospects/[id]'>) {
  const id = Number((await ctx.params).id);
  if (!Number.isInteger(id) || id <= 0) return Response.json({ error: 'invalid id' }, { status: 400 });
  const p = await getProspect(await ensureSellerId(), id);
  return p ? Response.json(p) : Response.json({ error: 'not found' }, { status: 404 });
}
