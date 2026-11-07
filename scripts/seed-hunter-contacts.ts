import { sql } from '../lib/db';

/** Paid-path seed, 7 Nov. Hunter company search. Free-tier runtime must not call this. */
const rows = [
  { id: 69720, name: 'ISLAND ELECTRIC CORP', person: 'Andrew', title: null, email: 'andrew@islandelectric.info', site: 'https://islandelectric.info', source: 'https://islandelectric.info/services-commercial-services.php' },
  { id: 378, name: 'SL GREEN REALTY CORP', person: 'Sonya Ruddy', title: 'Vice President, Retail Leasing', email: 'sonya.ruddy@slgreen.com', site: 'https://slgreen.com', source: 'https://slgreen.com/properties/485-lexington-avenue' },
  { id: 880, name: 'KALE CONSTRUCTION INC', person: 'Josh Winans', title: null, email: 'josh@kale-construction.com', site: 'https://kale-construction.com', source: 'https://kale-construction.com/about-us' },
  { id: 69638, name: 'SOLAS ELECTRICAL CORP', person: 'Conor Downey', title: 'Owner / Founder', email: 'office@solasnyc.com', site: 'https://solasnyc.com', source: 'https://solasnyc.com' },
  { id: 69825, name: 'HIVOLTS ELECTRICAL INC', person: 'Hivolts Electrical', title: null, email: 'jobs@hivoltelectrical.com', site: 'https://hivoltselectrical.com', source: 'https://hivoltselectrical.com' },
  { id: 69825, name: 'HIVOLTS ELECTRICAL INC', person: 'Moishy Rosman', title: 'Operations Manager', email: 'moishy@hivoltselectrical.com', site: 'https://hivoltselectrical.com', source: 'https://www.google.com/search?q=site:linkedin.com%20moishy%20rosman%20hivoltselectrical' },
  { id: 69767, name: 'A & S ELECTRIC INC.', person: 'A & S Electric Inc.', title: null, email: 'aselectricinc@aol.com', site: 'https://aselectricnyc.com', source: 'https://www.nybizdb.com/company/a-s-electric-inc-1384619/' },
  { id: 49, name: 'SUNRUN INSTALLATION SVC', person: 'Andy Blauvelt', title: 'Attorney Director', email: 'andy.blauvelt@sunrun.com', site: 'https://sunrun.com', source: 'https://docs.cpuc.ca.gov/PublishedDocs/Efile/G000/M613/K172/613172045.PDF' },
  { id: 255, name: 'VORNADO REALTY TRUST', person: 'Eva Kim', title: 'General Manager', email: 'ekim@vno.com', site: 'https://vno.com', source: 'https://mallsandstores.info/california---ca/1288-the-beverly-connection.html' },
  { id: 5, name: 'MOMENTUM SOLAR', person: 'Peter Clark', title: 'Director', email: 'pclark@momentumsolar.com', site: 'https://momentumsolar.com', source: 'https://highwire.princeton.edu/tag/industry' },
  { id: 182, name: 'CORE SCAFFOLD SYSTEMS INC', person: 'Willy Pilku', title: 'Chief Executive Officer', email: 'willy@corescaffold.com', site: 'https://corescaffold.com', source: 'https://www.google.com/search?q=site:linkedin.com%20willy%20pilku%20corescaffold' },
  { id: 420, name: 'ACE GROUP NY CORP.', person: 'Rosie', title: null, email: 'rosie@acegroupny.com', site: 'https://acegroupny.com', source: 'https://acegroupny.com' },
  { id: 69635, name: 'BERGER QUALITY ELEC\'L CON', person: 'Fabian Maliza', title: null, email: 'fabian@bergerqualityelectric.com', site: 'https://bergerqualityelectric.com', source: 'https://www.google.com/search?q=site:linkedin.com%20fabian%20maliza%20bergerqualityelectric' },
];

let saved = 0;
for (const row of rows) {
  const [company] = await sql<{ id: number }[]>`select id from companies where id = ${row.id} and name = ${row.name}`;
  if (!company) throw new Error(`company mismatch ${row.id} ${row.name}`);
  const [existing] = await sql<{ n: number }[]>`select count(*)::int as n from contacts where company_id = ${row.id} and email = ${row.email}`;
  if (!existing.n) {
    await sql`insert into contacts (company_id, name, title, email, website, source_url)
      values (${row.id}, ${row.person}, ${row.title}, ${row.email}, ${row.site}, ${row.source})`;
  }
  saved++;
  console.log(`ok ${row.id} ${row.name} ${row.email}`);
}
const [n] = await sql<{ rows: number; companies: number }[]>`
  select count(*)::int as rows, count(distinct company_id)::int as companies from contacts`;
console.log(`contact_rows=${n.rows} companies=${n.companies} seeded=${saved}`);
await sql.end();
