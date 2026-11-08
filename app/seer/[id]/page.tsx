import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/Icon';
import { Shell } from '@/components/Shell';
import { TierBadge } from '@/components/TierBadge';
import { Topbar } from '@/components/Topbar';
import { getProspect } from '@/lib/prospects';
import { ensureSellerId } from '@/lib/session';
import { DraftPanel } from '@/components/DraftPanel';

export const dynamic = 'force-dynamic';

const fmt = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

const STAR_LABEL = { keyword: 'Keyword', freshness: 'Freshness', place: 'Place', targetFit: 'Target fit' } as const;
type StarKey = keyof typeof STAR_LABEL;
const starValue = (v: number | null) => (v === null ? '—' : `${v} / 5`);

function Stars({ n }: { n: number | null }) {
  return (
    <span aria-hidden="true" style={{ letterSpacing: 1, color: 'var(--action-primary)' }}>
      {Array.from({ length: 5 }, (_, i) => (n !== null && i < n ? '★' : '☆')).join('')}
    </span>
  );
}

export default async function ProspectPage({ params }: PageProps<'/seer/[id]'>) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const sellerId = await ensureSellerId();
  const p = await getProspect(sellerId, id);
  if (!p) notFound();
  const region = [...new Set(p.signals.map((s) => s.region).filter(Boolean))].slice(0, 3).join(', ');
  const starRows = (Object.keys(STAR_LABEL) as StarKey[]).map((k) => ({ key: k, label: STAR_LABEL[k], value: p.stars[k] }));

  return (
    <Shell tab="seer" sellerId={sellerId} chat={{ tab: 'seer', title: 'Seer chat', placeholder: 'Ask about these prospects…' }}>
      <Topbar crumbs={['Seer', 'Prospects', p.name]} />
      <div className="content">
        <Link href="/seer" className="link" style={{ color: 'var(--text-secondary)', marginBottom: 20 }}><Icon name="arrowLeft" /> Back to prospects</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20 }}>
          <h1 style={{ margin: 0 }}>{p.name}</h1>
          <TierBadge tier={p.tier} />
        </div>
        <p className="lede" style={{ marginTop: 4 }}>
          {[region, p.state].filter(Boolean).join(' · ')}
          {p.outsideRegion && <> · <span className="badge badge-warn">Outside service region</span></>}
        </p>

        {/* Analysis — four 0–5 star rows + overall; scores are materialized, never LLM-computed (G8). */}
        <section className="card" style={{ marginTop: 24 }} aria-labelledby="analysis">
          <div className="card-head">
            <h2 id="analysis" style={{ fontSize: 14 }}>Analysis</h2>
            <span className="num" style={{ fontWeight: 600 }}>Overall {p.score ?? '—'} / 20</span>
          </div>
          <div className="card-body">
            {starRows.map((r) => (
              <div key={r.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
                <span>{r.label}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Stars n={r.value} />
                  <b className="num">{starValue(r.value)}</b>
                </span>
              </div>
            ))}
            <p className="muted" style={{ fontSize: 12, margin: '10px 0 0' }}>
              Scores are computed from dated public signals only. AI writes the interpretation below and never the scores.
            </p>
          </div>
        </section>

        {/* Contacts — seeded rows with sourceUrl per field (Q12/Q18). No row → honest not-found. */}
        <section className="card" style={{ marginTop: 16 }} aria-labelledby="contacts">
          <div className="card-head"><h2 id="contacts" style={{ fontSize: 14 }}>Contacts</h2></div>
          {p.contacts.length === 0 ? (
            <div className="card-body muted">No contact found. <a href={p.signals[0]?.url ?? '/seer'} target="_blank" rel="noopener noreferrer" className="link">See the source record</a></div>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {p.contacts.map((c) => (
                <li key={c.id} className="card-body" style={{ borderTop: '1px solid var(--border-row)', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="brand-mark" aria-hidden="true" style={{ textTransform: 'uppercase' }}>{c.name.slice(0, 1)}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{c.name}{c.title ? <span className="muted" style={{ fontWeight: 400 }}> · {c.title}</span> : null}</div>
                    <div className="muted" style={{ fontSize: 12 }}>
                      {c.email ? <a href={`mailto:${c.email}`} className="link" style={{ marginRight: 8 }}>{c.email}</a> : <span style={{ marginRight: 8 }}>Email: not found</span>}
                      <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer" className="link">Source</a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Email draft — one stored row per (seller, prospect); {contact.name} replaced at display (Q8). */}
        <DraftPanel
          companyId={p.id}
          companyName={p.name}
          contacts={p.contacts.map((c) => ({ id: c.id, name: c.name }))}
          draft={p.draft}
        />

        {/* Sources last (DESIGN.md frame 7–9 order). */}
        <section className="card" style={{ marginTop: 16 }} aria-labelledby="sources">
          <div className="card-head"><h2 id="sources" style={{ fontSize: 14 }}>Sources</h2><span className="muted" style={{ fontSize: 12 }}>{p.totalSignals} signals</span></div>
          {p.signals.length === 0 ? (
            <div className="card-body muted"><Icon name="activity" /> No signals from connected sources.</div>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {p.signals.slice(0, 20).map((s) => (
                <li key={s.id} className="signal">
                  <div>
                    <div className="num">{fmt(s.date)}</div>
                    <span className="badge" style={{ marginTop: 4 }}>Permit</span>
                  </div>
                  <div>
                    <div>{s.summary}</div>
                    <div className="why">{s.matched.length ? `Matched ${s.matched.map((m) => `"${m}"`).join(', ')} in permit description` : 'No product keyword matched'} · {s.source}</div>
                  </div>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="link" style={{ whiteSpace: 'nowrap' }}>Source record <Icon name="external" size={14} /><span className="sr-only">(opens in new tab)</span></a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Shell>
  );
}
