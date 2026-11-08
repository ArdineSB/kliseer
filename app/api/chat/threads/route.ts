import { createThread } from '@/lib/chat';
import { ensureSellerId } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  const threadId = await createThread(await ensureSellerId(), 'home');
  return Response.json({ threadId }, { status: 201 });
}
