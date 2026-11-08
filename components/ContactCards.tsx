'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Contact } from '@/lib/contact-fields';
import { ContactForm } from './ContactForm';
import { Icon, type IconName } from './Icon';

const initials = (n: string) => n.split(/\s+/).filter((w) => /[a-z0-9]/i.test(w)).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?';
const btn = 'flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-line bg-canvas text-[14px] font-medium';

function LinkIcon({ icon, href, label }: { icon: IconName; href: string | null; label: string }) {
  const box = 'grid size-10 place-items-center rounded-lg border border-line';
  // Q17: no URL → struck icon, not focusable, no fake link.
  if (!href) return <span className={`${box} bg-subtle text-muted`} title={`${label}: not found`}><Icon name={icon} struck size={18} /><span className="sr-only">{label}: not found</span></span>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${box} bg-canvas hover:bg-subtle ${icon === 'linkedin' ? 'text-linkedin' : 'text-brand'}`} title={label}>
      <Icon name={icon} size={18} filled={icon === 'linkedin'} /><span className="sr-only">{label} (opens in new tab)</span>
    </a>
  );
}

function Card({ c }: { c: Contact }) {
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  async function remove() {
    setMenu(false);
    if (!confirm(`Delete ${c.name}?`)) return;
    const res = await fetch(`/api/contacts/${c.id}`, { method: 'DELETE' }).catch(() => null);
    if (res?.ok) router.refresh();
  }
  return (
    <li className="flex flex-col rounded-xl border border-line bg-canvas">
      <div className="relative flex items-center gap-3 border-b border-line px-4 py-3">
        <span className="grid size-9 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-brand" aria-hidden="true">{initials(c.name)}</span>
        <b className="flex-1 truncate text-[15px] font-semibold">{c.name}</b>
        {c.manual && <span className="badge">Manual</span>}
        <button type="button" className="grid size-8 cursor-pointer place-items-center rounded-md border-0 bg-transparent text-secondary hover:bg-subtle" aria-label={`More for ${c.name}`} aria-expanded={menu} onClick={() => setMenu(!menu)}>•••</button>
        {menu && (
          <div className="absolute top-12 right-3 z-10 min-w-40 rounded-lg border border-line bg-canvas p-1 shadow-md" role="menu">
            <a role="menuitem" href={c.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-subtle"><Icon name="external" size={14} />Open source</a>
            {c.manual && <button role="menuitem" type="button" onClick={remove} className="flex w-full cursor-pointer items-center gap-2 rounded-md border-0 bg-transparent px-3 py-2 text-left text-error hover:bg-subtle"><Icon name="trash" size={14} />Delete</button>}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 px-4 py-3 text-secondary">
        <span className="flex items-center gap-2"><Icon name="briefcase" />{c.company}</span>
        <span className="flex items-center gap-2"><Icon name="user" />{c.title ?? 'Company contact'}</span>
        <span className="flex items-center gap-2 truncate"><Icon name="mail" />{c.email ?? 'Email: not found'}</span>
        <div className="mt-1 flex gap-2">
          <LinkIcon icon="linkedin" href={c.linkedinUrl} label="LinkedIn" />
          <LinkIcon icon="globe" href={c.website} label="Website" />
          <LinkIcon icon="share" href={c.socialUrl} label="Social" />
        </div>
      </div>
      <div className="mt-auto flex gap-2 border-t border-line px-4 py-3">
        {c.phone ? <a href={`tel:${c.phone.replace(/[^\d+]/g, '')}`} className={`${btn} hover:bg-subtle`}><Icon name="phone" />Phone</a>
          : <span className={`${btn} cursor-not-allowed text-muted`} aria-disabled="true" title="Phone: not found"><Icon name="phone" />Phone</span>}
        {c.email ? <a href={`mailto:${c.email}`} className={`${btn} hover:bg-subtle`}><Icon name="mail" />Email</a>
          : <span className={`${btn} cursor-not-allowed text-muted`} aria-disabled="true" title="Email: not found"><Icon name="mail" />Email</span>}
      </div>
    </li>
  );
}

/** Contacts section on the prospect detail (frame 7). */
export function ContactCards({ company, contacts, fallbackSource }: { company: { id: number; name: string }; contacts: Contact[]; fallbackSource: string | null }) {
  const [adding, setAdding] = useState(false);
  const linkedin = contacts.find((c) => c.linkedinUrl)?.linkedinUrl;
  return (
    <>
      {contacts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line px-5 py-6 text-secondary">
          <p className="m-0 font-medium text-ink">No contact found</p>
          <p className="mt-1 mb-0 text-[13px]">Phone: not found{fallbackSource && <> · <a href={fallbackSource} target="_blank" rel="noopener noreferrer" className="link">See the source record</a></>}</p>
        </div>
      ) : (
        <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0">{contacts.map((c) => <Card key={c.id} c={c} />)}</ul>
      )}
      <div className="mt-4 flex flex-wrap gap-3">
        {linkedin && <a href={linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-outline">Open LinkedIn <Icon name="arrowRight" size={14} /></a>}
        {!adding && <button type="button" className="btn btn-outline" onClick={() => setAdding(true)}><Icon name="plus" />Add contact manually</button>}
      </div>
      {adding && <div className="mt-4"><ContactForm company={company} onDone={() => setAdding(false)} /></div>}
    </>
  );
}
