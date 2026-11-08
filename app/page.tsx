import Link from 'next/link';
import { ChatPanel } from '@/components/ChatPanel';
import { Icon } from '@/components/Icon';
import { NAV, Shell } from '@/components/Shell';
import { Topbar } from '@/components/Topbar';
import { thread, threadHeads } from '@/lib/chat';
import { ensureSellerId } from '@/lib/session';

export const dynamic = 'force-dynamic';

const newChat = (
  <Link href="/" className="flex h-9 items-center gap-2 rounded-full border border-line px-4 text-[13px] font-medium hover:bg-subtle">
    <Icon name="plus" />New chat
  </Link>
);

// Home per frame 5013: history column 216px, centered hero, 844px composer with disclaimer.
export default async function Home() {
  const sellerId = await ensureSellerId();
  const [messages, heads] = await Promise.all([thread(sellerId, 'home'), threadHeads(sellerId)]);
  // Tabs removed from the sidebar (profiling, icp) have no NAV entry; skip their old threads.
  const others = heads.flatMap((h) => {
    const nav = NAV.find((n) => n.tab === h.tab);
    return h.tab !== 'home' && nav ? [{ ...h, nav }] : [];
  });
  return (
    <Shell tab="home" sellerId={sellerId}>
      <Topbar crumbs={['Home', 'Global chat']} right={newChat} />
      <div className="grid min-h-0 flex-1 grid-cols-[216px_1fr]">
        <nav className="flex min-h-0 flex-col overflow-auto border-r border-line px-5 py-7" aria-label="Your conversations">
          <h2 className="text-[15px]">Chats</h2>
          <Link href="/" className="gradient-border mt-4 flex h-10 items-center justify-center gap-2 rounded-full text-[13px] font-medium text-brand">
            <Icon name="plus" />New chat
          </Link>
          <p className="mt-7 mb-0 text-xs text-secondary">Your conversations</p>
          {others.length === 0 ? (
            <div className="mt-10">
              <span className="text-secondary"><Icon name="message" size={26} /></span>
              <p className="mt-3 mb-0 text-[13px] font-medium">No conversations yet</p>
              <p className="mt-2 mb-0 text-xs leading-5 text-secondary">Start a chat. Your threads will appear here, grouped by workspace.</p>
            </div>
          ) : (
            others.map((h) => (
              <div key={h.tab}>
                <h3 className="mx-2 mt-5 mb-1.5 text-xs font-normal text-muted">{h.nav.label}</h3>
                <Link href={`${h.nav.href}#msg-${h.id}`} title={h.content} className="block truncate rounded-md px-2 py-1.5 text-secondary hover:bg-hover">{h.content}</Link>
              </div>
            ))
          )}
          <p className="mt-auto mb-0 pt-6 text-xs leading-5 text-secondary">Home brings all your workspace threads together.</p>
        </nav>
        <ChatPanel tab="home" home placeholder="Ask about your company, target market, or prospects…" initial={messages} />
      </div>
    </Shell>
  );
}
