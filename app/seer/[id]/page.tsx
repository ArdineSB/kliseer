import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/Icon';
import { Shell } from '@/components/Shell';
import { TierBadge } from '@/components/TierBadge';
import { Topbar } from '@/components/Topbar';
import { getProspect } from '@/lib/prospects';
import { RECENT_DAYS } from '@/lib/tier';

export const dynamic = 'force-dynamic';

const fmt = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

// Plain-language reason for the tier; describes evidence, never a claim the company will buy (D-25).
const WHY: Record<string, string> = {
  S: `Two or more signals in the last ${RECENT_DAYS} days, at least one matching your products.`,
  A: `One signal in the last ${RECENT_DAYS} days that matches your products.`,
  B: `Recent signals, but none mention your product keywords.`,
  C: `No signals in the last ${RECENT_DAYS} days; older signals within a year.`,
  '—': 'No signals from connected sources.',
};

export default async function ProspectPage({ params }: PageProps<'/seer/[id]'>) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const p = await getProspect(id);
  if (!p) notFound();
  const region = [...new Set(p.signals.map((s) => s.region).filter(Boolean))].slice(0, 3).join(', ');

  return (
    <Shell tab="seer" chat={{ tab: 'seer', title: 'Seer chat', placeholder: 'Ask about these prospects…' }}>
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

        <section className="card" style={{ marginTop: 24 }} aria-labelledby="why-now">
          <div className="card-head"><h2 id="why-now" style={{ fontSize: 14 }}>Why now</h2><span className="muted" style={{ fontSize: 12 }}>{WHY[p.tier]}</span></div>
          {p.signals.length === 0 ? (
            <div className="card-body muted"><Icon name="activity" /> No signals from connected sources.</div>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {p.signals.map((s) => (
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

        <div className="detail-grid">
          <section className="card" aria-labelledby="dm">
            <div className="card-head"><h2 id="dm" style={{ fontSize: 14 }}>Decision makers</h2></div>
            <div className="card-body"><b>No decision makers yet</b><p className="muted" style={{ margin: '4px 0 0' }}>No connected source lists a contact with a source we can show.</p></div>
          </section>
          <section className="card" aria-labelledby="cw">
            <div className="card-head"><h2 id="cw" style={{ fontSize: 14 }}>Signal activity</h2></div>
            <div className="card-body kv">
              <div><span>Signals shown</span><b className="num">{p.signals.length}{p.totalSignals > p.signals.length ? ` of ${p.totalSignals}` : ''}</b></div>
              <div><span>Latest</span><b className="num">{p.signals[0] ? fmt(p.signals[0].date) : '—'}</b></div>
            </div>
          </section>
        </div>
      </div>
    </Shell>
  );
}
