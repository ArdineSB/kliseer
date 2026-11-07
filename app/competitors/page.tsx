import { Shell } from '@/components/Shell';
import { Topbar } from '@/components/Topbar';

export const dynamic = 'force-dynamic';

// Sample data from the FigCraft frame (D-23: basic frame only). Fictional companies, .example domains.
const ROWS = [
  { name: 'Tristate Power Supply', domain: 'tristate-power.example', products: 'Generators, ATS', regions: 'NY, NJ, CT', positioning: 'Fast delivery on standby units', sources: 2 },
  { name: 'Garden State Electric Distributors', domain: 'gselectric.example', products: 'Switchboards, panelboards', regions: 'NJ', positioning: 'Strong with electrical contractors', sources: 1 },
  { name: 'Empire Switchgear Co.', domain: 'empire-switchgear.example', products: 'Switchgear, transformers', regions: 'New York City', positioning: 'Custom switchgear builds', sources: 2 },
  { name: 'Atlantic Cable & Tray', domain: 'atlantic-tray.example', products: 'Cable tray', regions: 'NY, NJ, PA', positioning: 'Low price on cable tray', sources: 1 },
];

export default function CompetitorsPage() {
  return (
    <Shell tab="competitors" chat={{ tab: 'competitors', title: 'Competitors chat', placeholder: 'Ask about competitors…' }}>
      <Topbar crumbs={['Competitors']} right={<span className="sample">Sample data</span>} />
      <div className="content">
        <h1>Competitors</h1>
        <p className="lede" style={{ marginBottom: 24 }}>Suppliers that sell similar products to the same buyers.</p>
        <div className="table-wrap">
          <table>
            <thead><tr><th scope="col">Competitor</th><th scope="col">Overlapping products</th><th scope="col">Regions</th><th scope="col">Positioning</th><th scope="col" style={{ textAlign: 'right' }}>Sources</th></tr></thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.name}>
                  <td><b>{r.name}</b><div className="sub">{r.domain}</div></td>
                  <td>{r.products}</td><td>{r.regions}</td><td>{r.positioning}</td>
                  <td className="num" style={{ textAlign: 'right' }}>{r.sources}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="table-foot"><span>Showing {ROWS.length} competitors</span></div>
        </div>
      </div>
    </Shell>
  );
}
