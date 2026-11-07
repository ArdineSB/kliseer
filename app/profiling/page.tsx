import { Shell } from '@/components/Shell';
import { Topbar } from '@/components/Topbar';

export const dynamic = 'force-dynamic';

// Sample data from the FigCraft frame (D-23: basic frame only). Fictional companies, .example domains.
const ROWS = [
  { name: 'Northgate Builders', domain: 'northgate-builders.example', type: 'General contractor', employees: '120–200', location: 'Queens, NY', complete: true, updated: 'Oct 28' },
  { name: 'Hudson Yard Electric', domain: 'hudsonyard-electric.example', type: 'Electrical contractor', employees: '50–100', location: 'Manhattan, NY', complete: true, updated: 'Oct 24' },
  { name: 'Meadowlands Logistics Park', domain: 'meadowlands-lp.example', type: 'Industrial owner', employees: '—', location: 'Secaucus, NJ', complete: false, updated: 'Oct 15' },
  { name: 'Brightline Construction Group', domain: 'brightline-cg.example', type: 'General contractor', employees: '200–500', location: 'Newark, NJ', complete: false, updated: 'Oct 12' },
  { name: 'Ironbound Developers', domain: 'ironbound-dev.example', type: 'Developer', employees: '—', location: 'Jersey City, NJ', complete: false, updated: 'Oct 30' },
];

export default function ProfilingPage() {
  return (
    <Shell tab="profiling" chat={{ tab: 'profiling', title: 'Profiling chat', placeholder: 'Ask about a company…' }}>
      <Topbar crumbs={['Profiling']} right={<span className="sample">Sample data</span>} />
      <div className="content">
        <h1>Company profiles</h1>
        <p className="lede" style={{ marginBottom: 24 }}>What Kliseer knows about each company, gathered from connected sources.</p>
        <div className="table-wrap">
          <table>
            <thead><tr><th scope="col">Company</th><th scope="col">Type</th><th scope="col" style={{ textAlign: 'right' }}>Employees</th><th scope="col">Location</th><th scope="col">Profile</th><th scope="col">Updated</th></tr></thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.name}>
                  <td><b>{r.name}</b><div className="sub">{r.domain}</div></td>
                  <td>{r.type}</td>
                  <td className="num" style={{ textAlign: 'right' }}>{r.employees}</td>
                  <td>{r.location}</td>
                  <td><span className={`badge ${r.complete ? 'badge-ok' : 'badge-warn'}`}>{r.complete ? 'Complete' : 'Partial'}</span></td>
                  <td className="num">{r.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="table-foot"><span>Showing {ROWS.length} sample profiles</span></div>
        </div>
      </div>
    </Shell>
  );
}
