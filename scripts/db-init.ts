import { readFileSync } from 'node:fs';
import { sql } from '../lib/db';

await sql.unsafe(readFileSync('db/schema.sql', 'utf8'));

const [{ n }] = await sql<{ n: number }[]>`select count(*)::int as n from sellers`;
if (n === 0) {
  // Synthetic demo seller (docs/demo.md, D-08).
  await sql`insert into sellers ${sql({
    company: {
      name: 'Harborline Electrical Supply',
      website: '',
      products: ['Standby generator', 'Switchboard', 'Panelboard', 'Transformer', 'Cable tray', 'Automatic transfer switch (ATS)'],
      customerSegments: ['General contractor', 'Industrial facility', 'Commercial warehouse builder'],
      existingCustomers: [],
      region: ['NY', 'NJ'],
      priceRange: '',
      keywords: ['generator', 'switchboard', 'panelboard', 'switchgear', 'transformer', 'cable tray', 'transfer switch', 'ats', 'service upgrade', 'electrical service'],
    },
    icp: { industry: [], companySize: '', region: ['NY', 'NJ'], eventTypes: [] },
    target: { companyTypes: [], regions: [], buyerRoles: [] },
  } as never)}`;
}
const [{ sellers }] = await sql<{ sellers: number }[]>`select count(*)::int as sellers from sellers`;
console.log(`schema ok, sellers=${sellers}`);
await sql.end();
