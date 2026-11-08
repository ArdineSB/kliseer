import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { AnalysisText } from '@/components/AnalysisText';
import { ContactCards } from '@/components/ContactCards';
import { DraftPanel } from '@/components/DraftPanel';
import { Icon } from '@/components/Icon';
import { Shell } from '@/components/Shell';
import { Topbar } from '@/components/Topbar';
import { sql } from '@/lib/db';
import { LOOKUP_LIMIT } from '@/lib/lookup';
import { getViewer, ensureSellerId } from '@/lib/session';
import { getProspect } from '@/lib/prospects';

export const dynamic = 'force-dynamic';

const fmt = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

const STAR_LABEL = { keyword: 'Keyword', freshness: 'Freshness', place: 'Place', targetFit: 'Target fit' } as const;
type StarKey = keyof typeof STAR_LABEL;
const SECTIONS = [['analysis', 'Analysis'], ['profile', 'Company profile'], ['contacts', 'Contacts'], ['email-draft', 'Email draft'], ['sources', 'Sources']] as const;
const TIER_STYLE: Record<string, string> = { S: 'bg-[var(--tier-s-bg)] text-success', A: 'bg-[var(--tier-a-bg)] text-[var(--tier-a-text)]', B: 'bg-[var(--tier-b-bg)] text-[var(--tier-b-text)]' };

function Stars({ n, label }: { n: number | null; label: string }) {
  return (
    <span className="flex gap-0.5 text-brand" role="img" aria-label={n === null ? `${label}: not scored` : `${label}: ${n} of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => <Icon key={i} name="star" size={20} filled={n !== null && i < n} />)}
    </span>
  );
}

function Section({ id, title, right, children }: { id: string; title: string; right?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="mt-5 scroll-mt-4 rounded-xl border border-line bg-canvas p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 id={`${id}-h`} className="text-[17px]">{title}</h2>
        {right}
      </div>
      {children}
    </section>
  );
}

export default async function ProspectPage({ params }: PageProps<'/seer/[id]'>) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const viewer = (await getViewer()) ?? { sellerId: await ensureSellerId(), loggedIn: false };
  let lookupQuota: number | null = null;
  if (viewer.loggedIn) {
    const [{ used }] = await sql<{ used: number }[]>`select count(*)::int as used from contact_lookups
      where seller_id = ${viewer.sellerId} and created_at >= date_trunc('month', now())`;
    lookupQuota = LOOKUP_LIMIT - used;
  }
  const sellerId = await ensureSellerId();
  const p = await getProspect(sellerId, id);
  if (!p) notFound();
  const region = [...new Set(p.signals.map((s) => s.region).filter(Boolean))].slice(0, 3).join(', ');
  const domain = p.contacts.find((c) => c.website)?.website?.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  const starRows = (Object.keys(STAR_LABEL) as StarKey[]).map((k) => ({ key: k, label: STAR_LABEL[k], value: p.stars[k], reason: p.reasons[k] }));

  return (
    <Shell tab="seer" sellerId={sellerId} chat={{ tab: 'seer', title: 'Seer chat', placeholder: 'Ask about these prospects…' }}>
      <Topbar crumbs={['Seer', 'Prospects', p.name]} />
      <div className="content">
        <div className="mx-auto max-w-[808px]">
          <Link href="/seer" className="inline-flex h-9 items-center rounded-lg border border-line px-5 text-[13px] hover:bg-subtle">Back to prospects</Link>
          <h1 className="mt-7 mb-1 text-[28px] leading-9">{p.name}</h1>
          <p className="m-0 text-secondary">
            {[domain, region && `${region}, ${p.state}`].filter(Boolean).join(' · ') || p.state}
            {p.outsideRegion && <> · <span className="badge badge-warn">Outside service region</span></>}
          </p>

          <nav aria-label="Sections" className="mt-8 flex flex-wrap gap-2.5">
            {SECTIONS.map(([sid, label]) => (
              <a key={sid} href={`#${sid}`} className="inline-flex h-9 items-center rounded-lg border border-line px-7 text-[13px] hover:bg-subtle">{label}</a>
            ))}
          </nav>

          {/* Analysis — G8 stars are materialized by rules; AI only writes the paragraph. */}
          <Section id="analysis" title="Analysis" right={
            <span className="flex items-center gap-3">
              <b className="num text-[15px] font-semibold">Overall {p.score ?? '—'} / 20</b>
              <span className={`rounded-md px-6 py-1.5 text-[13px] font-medium ${TIER_STYLE[p.tier] ?? 'bg-[var(--tier-neutral-bg)] text-[var(--tier-neutral-text)]'}`}>Tier {p.tier}</span>
            </span>
          }>
            <div className="flex flex-col">
              {starRows.map((r, i) => (
                <div key={r.key} className={`grid grid-cols-[116px_auto_56px_1fr] items-center gap-3 rounded-md px-3 py-3 ${i % 2 === 0 ? 'bg-subtle' : ''}`}>
                  <span className="text-[13px]">{r.label}</span>
                  <Stars n={r.value} label={r.label} />
                  <b className="num text-[13px] font-normal">{r.value === null ? '—' : `${r.value} / 5`}</b>
                  <span className="text-[13px] text-secondary">{r.reason}</span>
                </div>
              ))}
            </div>
            <AnalysisText companyId={p.id} initial={p.analysis} />
          </Section>

          <section id="profile" aria-labelledby="profile-h" className="mt-5 scroll-mt-4 overflow-hidden rounded-xl border border-line bg-canvas">
            <h2 id="profile-h" className="px-5 pt-5 pb-3 text-[17px]">Company profile</h2>
            <dl className="m-0">
              {p.profile.map((r) => (
                <div key={r.label} className="grid grid-cols-[160px_1fr_auto] gap-4 border-t border-row px-5 py-3 text-[13px]">
                  <dt className="text-label">{r.label}</dt>
                  <dd className={`m-0 text-[14px] ${r.value ? '' : 'text-muted'}`}>{r.value ?? 'Not found'}</dd>
                  <dd className="m-0">{r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" className="link text-xs">Source<span className="sr-only"> for {r.label} (opens in new tab)</span></a>}</dd>
                </div>
              ))}
            </dl>
          </section>

          <Section id="contacts" title="Contacts">
            <ContactCards company={{ id: p.id, name: p.name }} contacts={p.contacts} fallbackSource={p.signals[0]?.url ?? null} canLookup={viewer.loggedIn} quotaLeft={lookupQuota} />
          </Section>

          {/* Email draft — one stored row per (seller, prospect); {contact.name} replaced at display (Q8). */}
          <DraftPanel companyId={p.id} companyName={p.name} contacts={p.contacts.map((c) => ({ id: c.id, name: c.name }))} draft={p.draft} />

          {/* Sources last (DESIGN.md frame 7–9 order). */}
          <section id="sources" aria-labelledby="sources-h" className="mt-5 mb-8 scroll-mt-4 overflow-hidden rounded-xl border border-line bg-canvas">
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <h2 id="sources-h" className="text-[17px]">Sources</h2>
              <span className="text-xs text-muted">{p.totalSignals} signals</span>
            </div>
            {p.signals.length === 0 ? (
              <div className="border-t border-row px-5 py-4 text-muted"><Icon name="activity" /> No signals from connected sources.</div>
            ) : (
              <ul className="m-0 list-none p-0">
                {p.signals.slice(0, 20).map((s) => (
                  <li key={s.id} className="signal">
                    <div>
                      <div className="num">{fmt(s.date)}</div>
                      <span className="badge mt-1">Permit</span>
                    </div>
                    <div>
                      <div>{s.summary}</div>
                      <div className="why">{s.matched.length ? `Matched ${s.matched.map((m) => `"${m}"`).join(', ')} in permit description` : 'No product keyword matched'} · {s.source}</div>
                    </div>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="link whitespace-nowrap">Source record <Icon name="external" size={14} /><span className="sr-only">(opens in new tab)</span></a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </Shell>
  );
}
