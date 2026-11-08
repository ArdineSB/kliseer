import Link from 'next/link';
import { NAV, Shell } from '@/components/Shell';
import { NewChatButton } from '@/components/NewChatButton';
import { LoadDemoButton } from '@/components/LoadDemoButton';
import { ChatPanel } from '@/components/ChatPanel';
import { Icon } from '@/components/Icon';
import { Topbar } from '@/components/Topbar';
import { defaultThread, ownedThread, thread, threadHeads } from '@/lib/chat';
import { ensureSellerId, getViewer } from '@/lib/session';
import { getSeller } from '@/lib/seller';
import type { Seller } from '@/lib/fields';

export const dynamic = 'force-dynamic';

const hasValue = (v: unknown) => Array.isArray(v) ? v.length > 0 : typeof v === 'string' ? Boolean(v.trim()) : Boolean(v);
const blankProfile = (seller: Seller) =>
  [seller.company, seller.icp, seller.target].every((section) => !Object.values(section).some(hasValue));

export default async function Home({ searchParams }: PageProps<'/'>) {
  const params = await searchParams;
  const requested = Array.isArray(params.thread) ? params.thread[0] : params.thread;
  const sellerId = await ensureSellerId();
  const [viewer, seller] = await Promise.all([getViewer(), getSeller(sellerId)]);
  const heads = await threadHeads(sellerId);
  const selected = requested && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requested) && await ownedThread(sellerId, 'home', requested) ? requested : null;
  const threadId = selected ?? heads.find((item) => item.tab === 'home')?.id ?? await defaultThread(sellerId, 'home');
  const messages = await thread(sellerId, 'home', threadId);
  const grouped = new Map<string, { id: string; title: string; href: string; lastMessage: string }[]>();
  for (const item of heads) {
    const nav = item.tab === 'home' ? { label: 'Home', href: '/' } : NAV.find((n) => n.tab === item.tab);
    if (!nav) continue;
    const href = item.tab === 'home'
      ? `/?thread=${encodeURIComponent(item.id)}#msg-${item.lastMessageId}`
      : `${nav.href}#msg-${item.lastMessageId}`;
    const rows = grouped.get(nav.label) ?? [];
    rows.push({ id: item.id, title: item.title, href, lastMessage: item.lastMessage });
    grouped.set(nav.label, rows);
  }
  const canLoadDemo = viewer?.loggedIn === false && blankProfile(seller);

  return (
    <Shell tab="home" sellerId={sellerId}>
      <Topbar crumbs={['Home', 'Global chat']} right={
        <div className="flex items-center gap-2">
          {canLoadDemo && <LoadDemoButton />}
          <NewChatButton variant="topbar" />
        </div>
      } />
      <div className="grid min-h-0 flex-1 grid-cols-[216px_1fr]">
        <nav className="flex min-h-0 flex-col overflow-auto border-r border-line px-5 py-7" aria-label="Your conversations">
          <h2 className="text-[15px]">Chats</h2>
          <NewChatButton variant="sidebar" />
          <p className="mt-7 mb-0 text-xs text-secondary">Your conversations</p>
          {grouped.size === 0 ? (
            <div className="mt-10">
              <span className="text-secondary"><Icon name="message" size={26} /></span>
              <p className="mt-3 mb-0 text-[13px] font-medium">No conversations yet</p>
              <p className="mt-2 mb-0 text-xs leading-5 text-secondary">Start a chat. Your threads will appear here, grouped by workspace.</p>
            </div>
          ) : [...grouped].map(([label, rows]) => (
            <div key={label}>
              <h3 className="mx-2 mt-5 mb-1.5 text-xs font-normal text-muted">{label}</h3>
              {rows.map((row) => <Link key={row.id} href={row.href} title={row.lastMessage} className="block truncate rounded-md px-2 py-1.5 text-secondary hover:bg-hover">{row.title || row.lastMessage}</Link>)}
            </div>
          ))}
          <p className="mt-auto mb-0 pt-6 text-xs leading-5 text-secondary">Home brings all your workspace threads together.</p>
        </nav>
        <ChatPanel key={threadId} tab="home" threadId={threadId} home placeholder="Ask about your company, target market, or prospects…" initial={messages} />
      </div>
    </Shell>
  );
}
