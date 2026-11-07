import Link from 'next/link';
import { Icon } from '@/components/Icon';
import { Shell } from '@/components/Shell';
import { Topbar } from '@/components/Topbar';
import { recentSignals } from '@/lib/prospects';

export const dynamic = 'force-dynamic';

const fmt = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

export default async function SignalsPage() {
  const rows = await recentSignals(100);
  return (
    <Shell tab="signals" chat={{ tab: 'signals', title: 'Signals chat', placeholder: 'Ask about signals…' }}>
      <Topbar crumbs={['Signals']} />
      <div className="content">
        <div className="page-head">
          <div>
            <h1>Signals</h1>
            <p className="lede">Latest dated records from connected public sources.</p>
          </div>
        </div>
        {rows.length === 0 ? (
          <div className="card empty"><h2>No signals yet</h2><p>Run the ingest to pull records from connected sources.</p></div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th scope="col">Date</th><th scope="col">Company</th><th scope="col">Summary</th><th scope="col">Source</th></tr></thead>
              <tbody>
                {rows.map((s) => (
                  <tr key={s.id}>
                    <td className="num" style={{ whiteSpace: 'nowrap' }}>{fmt(s.date)}</td>
                    <td><Link href={`/seer/${s.company_id}`} className="row-link">{s.company}</Link></td>
                    <td><div className="clamp">{s.summary}</div></td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="link">{s.source} <Icon name="external" size={14} /><span className="sr-only">(opens in new tab)</span></a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="table-foot"><span>Showing the latest {rows.length} signals</span></div>
          </div>
        )}
      </div>
    </Shell>
  );
}
