import { LlmUnavailable, sendMessage, thread, TABS, type Tab } from '@/lib/chat';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const isTab = (t: unknown): t is Tab => typeof t === 'string' && (TABS as readonly string[]).includes(t);

export async function GET(req: Request) {
  const tab = new URL(req.url).searchParams.get('tab');
  if (!isTab(tab)) return Response.json({ error: 'invalid tab' }, { status: 400 });
  return Response.json(await thread(tab));
}

export async function POST(req: Request) {
  const body: unknown = await req.json().catch(() => null);
  if (!body || typeof body !== 'object' || !('tab' in body) || !('message' in body)) return Response.json({ error: 'tab and message required' }, { status: 400 });
  const { tab, message } = body;
  if (!isTab(tab)) return Response.json({ error: 'invalid tab' }, { status: 400 });
  if (typeof message !== 'string' || !message.trim() || message.length > 4000) return Response.json({ error: 'message must be 1–4000 chars' }, { status: 400 });
  try {
    return Response.json(await sendMessage(tab, message.trim()));
  } catch (e) {
    if (e instanceof LlmUnavailable) return Response.json({ error: 'LLM unavailable' }, { status: 502 });
    throw e;
  }
}
