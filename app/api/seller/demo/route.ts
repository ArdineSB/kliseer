import { loadGuestDemo } from '@/lib/seller';
import { getViewer } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  const viewer = await getViewer();
  if (!viewer || viewer.loggedIn) return Response.json({ error: 'Guest mode is required to load demo data.' }, { status: 403 });
  const seller = await loadGuestDemo(viewer.sellerId);
  if (!seller) return Response.json({ error: 'Demo data can only be loaded into a blank guest workspace.' }, { status: 409 });
  return Response.json({ ok: true, company: seller.company.name });
}
