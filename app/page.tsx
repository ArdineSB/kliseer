import Link from 'next/link';
import { ChatPanel } from '@/components/ChatPanel';
import { NAV, Shell } from '@/components/Shell';
import { Topbar } from '@/components/Topbar';
import { thread, threadHeads } from '@/lib/chat';
import { ensureSellerId } from '@/lib/session';

export const dynamic = 'force-dynamic';

// Home per approved frame 5013: greeting, assistant card (gradient border),
// three setup cards, four actions, suggested prompt, 844px composer with disclaimer.
export default async function Home() {
  const sellerId = await ensureSellerId();
  const [messages, heads] = await Promise.all([thread(sellerId, 'home'), threadHeads(sellerId)]);
  const others = heads.filter((h) => h.tab !== 'home');
  return (
    <Shell tab="home" sellerId={sellerId}>
      <Topbar crumbs={['Home']} />
      <div className="home">
        <nav className="history" aria-label="Your conversations">
          <header>
            <h2>Chats</h2>
            <span className="muted">Your conversations</span>
          </header>
          <Link href="/" className="btn new-chat">New chat</Link>
          {others.length === 0 ? (
            <p className="muted history-empty">No conversations yet</p>
          ) : (
            others.map((h) => {
              const nav = NAV.find((n) => n.tab === h.tab)!;
              return (
                <div key={h.tab}>
                  <h3>{nav.label}</h3>
                  <Link href={`${nav.href}#msg-${h.id}`} title={h.content}>{h.content}</Link>
                </div>
              );
            })
          )}
        </nav>
        <ChatPanel
          tab="home"
          placeholder="Ask about your company, target market, or prospects…"
          initial={messages}
          suggestedPrompt="Which companies would be a good fit for what I sell?"
          hero={
            <div className="home-hero">
              <p className="hero-kicker">Your prospecting partner</p>
              <h1>Hi there. What’s your next opportunity?</h1>
              <p className="hero-sub">Start a chat. Your threads will appear here, grouped by workspace.</p>
              <div className="hero-cards">
                <div className="hero-card assistant">
                  <b>Connect your products to the companies that need them.</b>
                  <span>Klise helps you describe what you sell and finds who needs it.</span>
                </div>
                <Link className="hero-card" href="/setup/company"><b>Company profile</b><span>Tell Kliseer what you sell</span></Link>
                <Link className="hero-card" href="/setup/icp"><b>Define ICP</b><span>Who fits you best</span></Link>
                <Link className="hero-card" href="/setup/target"><b>Set targets</b><span>Where and whom to look for</span></Link>
              </div>
              <div className="hero-actions">
                <Link className="btn btn-outline" href="/setup/company">Company profile</Link>
                <Link className="btn btn-outline" href="/setup/icp">Define ICP</Link>
                <Link className="btn btn-outline" href="/setup/target">Set targets</Link>
                <Link className="btn btn-outline" href="/seer">View prospects</Link>
              </div>
            </div>
          }
        />
      </div>
    </Shell>
  );
}
