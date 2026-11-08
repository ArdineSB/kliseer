import Link from 'next/link';
import type { ReactNode } from 'react';
import { thread, type Tab } from '@/lib/chat';
import { ensureSellerId, getViewer } from '@/lib/session';
import { BrandLockup } from './BrandLockup';
import { ChatPanel } from './ChatPanel';
import { SidebarToggle } from './SidebarToggle';
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
  { tab: 'contacts', label: 'Contacts', href: '/contacts', icon: 'contact' },
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
    <div className={`shell${chat ? '' : ' shell--home'}`}>
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link href="/" className="brand" aria-label="Kliseer home"><BrandLockup size={28} /></Link>
          <SidebarToggle />
        </div>
        <nav className="nav" aria-label="Main">
          {NAV.map((n, i) => (
            <div key={n.tab}>
              {i === 1 && <div className="nav-label">Workspace</div>}
              <Link href={n.href} className="nav-item" aria-label={n.label} title={n.label} aria-current={n.tab === tab ? 'page' : undefined}>
                <Icon name={n.icon} /><span className="nav-text">{n.label}</span>
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
        <div className={setupStep ? 'py-3' : 'mt-auto py-3'}>
          {viewer?.loggedIn ? <LogoutButton /> : <Link href="/login" aria-label="Log in" title="Log in" className="nav-item"><Icon name="logIn" /><span className="nav-text">Log in</span></Link>}
        </div>
      </aside>
      <main className="panel">{children}</main>
      {chat && <ChatPanel tab={chat.tab} title={chat.title} placeholder={chat.placeholder} initial={messages} />}
    </div>
  );
}
