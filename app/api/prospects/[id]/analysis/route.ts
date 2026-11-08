import { generateAnalysis } from '@/lib/analysis';
import { LlmUnavailable } from '@/lib/chat';
import { getProspect } from '@/lib/prospects';
import { getSeller } from '@/lib/seller';
import { ensureSellerId } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(_req: Request, ctx: RouteContext<'/api/prospects/[id]/analysis'>) {
  const id = Number((await ctx.params).id);
  if (!Number.isInteger(id) || id <= 0) return Response.json({ error: 'invalid id' }, { status: 400 });
  const sellerId = await ensureSellerId();
  const [p, seller] = await Promise.all([getProspect(sellerId, id), getSeller(sellerId)]);
  if (!p) return Response.json({ error: 'not found' }, { status: 404 });
  const products = seller.company.products;
  try {
    const body = await generateAnalysis(sellerId, p, { name: String(seller.company.name ?? ''), products: Array.isArray(products) ? products : products ? [products] : [] });
    return Response.json({ body });
  } catch (e) {
    if (e instanceof LlmUnavailable) return Response.json({ error: 'LLM unavailable' }, { status: 502 });
    throw e;
  }
}
