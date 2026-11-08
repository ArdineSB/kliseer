import { cleanFields, SECTIONS, type Section } from '@/lib/fields';
import { getSeller, saveSection } from '@/lib/seller';
import { ensureSellerId } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json(await getSeller(await ensureSellerId()));
}

export async function PUT(req: Request) {
  const body: unknown = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') return Response.json({ error: 'invalid JSON' }, { status: 400 });
  const { section, data, approve } = body as { section?: unknown; data?: unknown; approve?: unknown };
  if (typeof section !== 'string' || !SECTIONS.includes(section as Section)) return Response.json({ error: 'section must be company, icp or target' }, { status: 400 });
  if (approve !== undefined && typeof approve !== 'boolean') return Response.json({ error: 'approve must be boolean' }, { status: 400 });
  const clean = cleanFields(section as Section, data);
  if (!clean.ok) return Response.json({ error: clean.error }, { status: 400 });
  return Response.json(await saveSection(await ensureSellerId(), section as Section, clean.value, approve === true));
}
