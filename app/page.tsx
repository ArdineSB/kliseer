import Link from 'next/link';
import { ChatPanel } from '@/components/ChatPanel';
import { NAV, Shell } from '@/components/Shell';
import { Topbar } from '@/components/Topbar';
import { thread, threadHeads } from '@/lib/chat';
import { ensureSellerId } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const sellerId = await ensureSellerId();
  const [messages, heads] = await Promise.all([thread(sellerId, 'home'), threadHeads(sellerId)]);
  const others = heads.filter((h) => h.tab !== 'home');
  return (
    <Shell tab="home" sellerId={sellerId}>
      <Topbar crumbs={['Home']} />
      <div className="home">
        <nav className="history" aria-label="Chat history by tab">
          <Link href="/" className="btn btn-outline" style={{ display: 'inline-flex' }}>New chat</Link>
          {others.length === 0 && <p className="muted" style={{ margin: '20px 8px', fontSize: 12 }}>Tab threads appear here once you chat in a tab.</p>}
          {others.map((h) => {
            const nav = NAV.find((n) => n.tab === h.tab)!;
            return (
              <div key={h.tab}>
                <h3>{nav.label}</h3>
                <Link href={`${nav.href}#msg-${h.id}`} title={h.content}>{h.content}</Link>
              </div>
            );
          })}
        </nav>
        <ChatPanel
          tab="home"
          placeholder="Ask Kliseer anything…"
          initial={messages}
          hero={
            <>
              <h1>What should we work on?</h1>
              <p className="lede">Ask about your setup, prospects or signals. Each tab also keeps its own thread.</p>
              <div className="chips" style={{ order: 1 }}>
                <Link href="/seer?tier=S"><b>Find Tier S prospects</b><span>Opens Seer with the filter set</span></Link>
                <Link href="/signals"><b>See this week&apos;s signals</b><span>Latest permits from connected sources</span></Link>
                <Link href="/setup/review"><b>Review my company profile</b><span>Check what Klise has saved</span></Link>
              </div>
            </>
          }
        />
      </div>
    </Shell>
  );
}
