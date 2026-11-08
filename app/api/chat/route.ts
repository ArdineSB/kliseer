import { defaultThread, LlmUnavailable, ownedThread, sendMessage, TABS, thread, type Tab } from '@/lib/chat';
import { ensureSellerId } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const isTab = (t: unknown): t is Tab => typeof t === 'string' && (TABS as readonly string[]).includes(t);
const isThreadId = (v: unknown): v is string => typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const tab = params.get('tab');
  if (!isTab(tab)) return Response.json({ error: 'invalid tab' }, { status: 400 });
  const sellerId = await ensureSellerId();
  const requested = params.get('threadId');
  if (requested && !isThreadId(requested)) return Response.json({ error: 'invalid threadId' }, { status: 400 });
  const threadId = requested ?? await defaultThread(sellerId, tab);
  if (!await ownedThread(sellerId, tab, threadId)) return Response.json({ error: 'chat thread not found' }, { status: 404 });
  return Response.json(await thread(sellerId, tab, threadId));
}

export async function POST(req: Request) {
  const body: unknown = await req.json().catch(() => null);
  if (!body || typeof body !== 'object' || !('tab' in body) || !('message' in body)) return Response.json({ error: 'tab and message required' }, { status: 400 });
  const { tab, message } = body;
  if (!isTab(tab)) return Response.json({ error: 'invalid tab' }, { status: 400 });
  if (typeof message !== 'string' || !message.trim() || message.length > 4000) return Response.json({ error: 'message must be 1–4000 chars' }, { status: 400 });
  if ('threadId' in body && !isThreadId(body.threadId)) return Response.json({ error: 'invalid threadId' }, { status: 400 });
  const sellerId = await ensureSellerId();
  const threadId = 'threadId' in body ? body.threadId as string : await defaultThread(sellerId, tab);
  if (!await ownedThread(sellerId, tab, threadId)) return Response.json({ error: 'chat thread not found' }, { status: 404 });
  try {
    return Response.json(await sendMessage(sellerId, tab, threadId, message.trim()));
  } catch (e) {
    if (e instanceof LlmUnavailable) return Response.json({ error: 'LLM unavailable' }, { status: 502 });
    throw e;
  }
}
