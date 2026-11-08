import Link from 'next/link';
import type { ReactNode } from 'react';
import { thread, type Tab } from '@/lib/chat';
import { ensureSellerId, getViewer } from '@/lib/session';
import { BrandLockup } from './BrandLockup';
import { ChatPanel } from './ChatPanel';
import { Icon, type IconName } from './Icon';
import { LogoutButton } from './LogoutButton';

// Sidebar order is fixed (DESIGN.md §4, D-19).
export const NAV: { tab: Tab; label: string; href: string; icon: IconName }[] = [
  { tab: 'home', label: 'Home', href: '/', icon: 'home' },
  { tab: 'klise', label: 'Klise', href: '/setup/company', icon: 'building' },
  { tab: 'target', label: 'Target', href: '/setup/target', icon: 'target' },
  { tab: 'seer', label: 'Seer', href: '/seer', icon: 'eye' },
  { tab: 'signals', label: 'Signals', href: '/signals', icon: 'activity' },
  { tab: 'competitors', label: 'Competitors', href: '/competitors', icon: 'users' },
  { tab: 'profiling', label: 'Profiling', href: '/profiling', icon: 'file' },
  { tab: 'icp', label: 'ICP', href: '/setup/icp', icon: 'userCheck' },
];

type Props = {
  tab: Tab;
  /** Seller row for this viewer; pages that already resolved it pass it through. */
  sellerId?: number;
  /** Chat thread shown on the right; omit for Home (its chat is the main content). */
  chat?: { tab: Tab; title: string; placeholder: string };
  setupStep?: number;
  children: ReactNode;
};

export async function Shell({ tab, sellerId, chat, setupStep, children }: Props) {
  // Pages that resolved the viewer pass sellerId; Shell resolves (and lazily creates) a guest otherwise.
  const sid = sellerId ?? (await ensureSellerId());
  const viewer = await getViewer();
  const messages = chat ? await thread(sid, chat.tab) : [];
  return (
    <div className="shell" style={chat ? undefined : { gridTemplateColumns: '212px minmax(0, 1fr)' }}>
      <aside className="sidebar">
        <Link href="/" className="brand" aria-label="Kliseer home"><BrandLockup size={28} /></Link>
        <nav className="nav" aria-label="Main">
          {NAV.map((n, i) => (
            <div key={n.tab}>
              {i === 1 && <div className="nav-label">Workspace</div>}
              <Link href={n.href} className="nav-item" aria-current={n.tab === tab ? 'page' : undefined}>
                <Icon name={n.icon} />{n.label}
              </Link>
            </div>
          ))}
        </nav>
        {setupStep && (
          <div className="setup-card" aria-label={`Setup step ${setupStep} of 4`}>
            <header>Setup <span>{setupStep} of 4</span></header>
            <div className="setup-bar" aria-hidden="true">{[1, 2, 3, 4].map((s) => <i key={s} className={s <= setupStep ? 'on' : ''} />)}</div>
          </div>
        )}
        {/* G3: guest sees Log in, user sees Log out. */}
        <div style={{ padding: '12px 8px' }}>
          {viewer?.loggedIn ? <LogoutButton /> : <Link href="/login" className="btn btn-outline" style={{ display: 'flex' }}>Log in</Link>}
        </div>
      </aside>
      <main className="panel">{children}</main>
      {chat && <ChatPanel tab={chat.tab} title={chat.title} placeholder={chat.placeholder} initial={messages} />}
    </div>
  );
}
