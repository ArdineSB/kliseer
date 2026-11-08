import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { Shell } from '@/components/Shell';
import { TierBadge } from '@/components/TierBadge';
import { Topbar } from '@/components/Topbar';
import { listProspects, TOP, type ProspectFilter } from '@/lib/prospects';
import { SOURCES } from '@/lib/sources';
import { ensureSellerId } from '@/lib/session';

export const dynamic = 'force-dynamic';

const TIERS = ['S', 'A', 'B', 'C'] as const;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;
const fmt = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

export default async function SeerPage({ searchParams }: PageProps<'/seer'>) {
  const sp = await searchParams;
  const f: ProspectFilter = {
    q: one(sp.q)?.slice(0, 100),
    tier: TIERS.find((t) => t === one(sp.tier)),
    source: SOURCES.find((s) => s.id === one(sp.source))?.id,
    page: Math.max(1, Number(one(sp.page)) || 1),
  };
  const sellerId = await ensureSellerId();
  const r = await listProspects(sellerId, f);
  const href = (patch: Partial<ProspectFilter>) => {
    const p = new URLSearchParams();
    const next = { ...f, page: undefined, ...patch };
    for (const [k, v] of Object.entries(next)) if (v !== undefined && v !== '' && !(k === 'page' && v === 1)) p.set(k, String(v));
    const qs = p.toString();
    return qs ? `/seer?${qs}` : '/seer';
  };
  const filtered = Boolean(f.q || f.tier || f.source);
  // Q6: default view shows the top 20; the rest sits behind the upgrade gate (UI only, no billing).
  const gated = !filtered && (f.page ?? 1) === 1 && r.items.length > TOP;
  const items = gated ? r.items.slice(0, TOP) : r.items;

  return (
    <Shell tab="seer" sellerId={sellerId} chat={{ tab: 'seer', title: 'Seer chat', placeholder: 'Ask about these prospects…' }}>
      <Topbar crumbs={['Seer', 'Prospects']} />
      <div className="content">
        <div className="page-head">
          <div>
            <h1>Prospects</h1>
            <p className="lede">Companies with dated public signals, ranked by fit with your products.</p>
          </div>
        </div>

        <div className="card metrics">
          <div><span>Prospects</span><b className="num">{r.summary.total.toLocaleString('en-US')}</b></div>
          <div><span>Tier S</span><b className="num">{r.summary.tierS.toLocaleString('en-US')}</b></div>
          <div><span>New this week</span><b className="num">{r.summary.new.toLocaleString('en-US')}</b></div>
        </div>

        <form className="toolbar" action="/app/seer" role="search">
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="search">
              <Icon name="search" />
              <label htmlFor="q" className="sr-only">Search company</label>
              <input id="q" name="q" type="search" defaultValue={f.q} placeholder="Search company" maxLength={100} />
            </div>
            <label htmlFor="source" className="sr-only">Source</label>
            <select id="source" name="source" defaultValue={f.source ?? ''}>
              <option value="">All sources</option>
              {SOURCES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
            {f.tier && <input type="hidden" name="tier" value={f.tier} />}
            <button className="btn btn-outline" type="submit">Apply</button>
          </div>
          <nav className="segmented" aria-label="Filter by tier">
            <Link href={href({ tier: undefined })} aria-current={!f.tier ? 'true' : undefined}>All</Link>
            {TIERS.map((t) => <Link key={t} href={href({ tier: t })} aria-current={f.tier === t ? 'true' : undefined}>{t}</Link>)}
          </nav>
        </form>

        {r.summary.total === 0 && !filtered ? (
          <div className="card empty">
            <h2>No prospects yet</h2>
            <p>No signals from connected sources in the last 365 days. <Link href="/setup/review" className="link">Edit target</Link></p>
          </div>
        ) : r.items.length === 0 ? (
          <div className="card empty">
            <h2>No prospects match these filters</h2>
            <p><Link href="/seer" className="link">Clear search</Link></p>
          </div>
        ) : (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th scope="col">Tier</th><th scope="col">Company</th><th scope="col">Score</th><th scope="col">Latest signal</th><th scope="col" style={{ textAlign: 'right' }}>Signals 90d</th><th scope="col">Last signal</th></tr>
                </thead>
                <tbody>
                  {items.map((p) => (
                    <tr key={p.id}>
                      <td><TierBadge tier={p.tier} /></td>
                      <td>
                        <Link href={`/seer/${p.id}`} className="row-link">{p.name}</Link>
                        <div className="sub">{p.sources.join(', ')}</div>
                      </td>
                      <td className="num">{p.score ?? '—'}</td>
                      <td><div className="clamp">{p.lastSummary}</div><div className="sub">{p.matched > 0 ? `${p.matched} signal${p.matched === 1 ? '' : 's'} matched your keywords` : 'No product keyword matched'}</div></td>
                      <td className="num" style={{ textAlign: 'right' }}>{p.recent}</td>
                      <td className="num" style={{ whiteSpace: 'nowrap' }}>{fmt(p.lastDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {gated ? (
                <div className="upgrade-gate" style={{ padding: '20px', textAlign: 'center', borderTop: '1px solid var(--border-default)' }}>
                  <b>Upgrade to view all</b>
                  <p className="muted" style={{ fontSize: 13, margin: '6px 0 0' }}>You are viewing the top {TOP} prospects.</p>
                </div>
              ) : (
                <div className="table-foot">
                  <span className="num">Showing {((r.page - 1) * r.pageSize + 1).toLocaleString('en-US')}–{Math.min(r.page * r.pageSize, r.filteredTotal).toLocaleString('en-US')} of {r.filteredTotal.toLocaleString('en-US')}</span>
                  <nav className="pager" aria-label="Pages">
                    {r.page > 1 && <Link className="link" href={href({ page: r.page - 1 })}>Previous</Link>}
                    {r.page < Math.max(1, Math.ceil(r.filteredTotal / r.pageSize)) && <Link className="link" href={href({ page: r.page + 1 })}>Next</Link>}
                  </nav>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Shell>
  );
}
