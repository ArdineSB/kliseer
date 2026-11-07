import { listProspects } from '@/lib/prospects';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TIERS = ['S', 'A', 'B', 'C', '—'];

export async function GET(req: Request) {
  const p = new URL(req.url).searchParams;
  const tier = p.get('tier') ?? undefined;
  if (tier && !TIERS.includes(tier)) return Response.json({ error: 'tier must be S, A, B, C or —' }, { status: 400 });
  const q = p.get('q') ?? undefined;
  if (q && q.length > 100) return Response.json({ error: 'q too long' }, { status: 400 });
  const page = Number(p.get('page') ?? 1);
  return Response.json(await listProspects({ q, tier, source: p.get('source') ?? undefined, page: Number.isInteger(page) && page > 0 ? page : 1 }));
}
