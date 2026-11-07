type Row = Record<string, unknown>;
export type Mapped = { companyName: string | null; date: string | null; summary: string; region: string | null; recordId: string | null; url: string | null };

export type SodaSource = {
  id: string;
  label: string;
  state: string;
  endpoint: string; // https://.../resource/<id>.json
  dateField: string;
  recordIdField: string;
  where?: string;
  map: (r: Row) => Mapped;
};

const s = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : null);
function linkUrl(v: unknown): string | null {
  if (typeof v === 'string') return s(v);
  if (!v || typeof v !== 'object' || !('url' in v)) return null;
  return s(v.url);
}
const join = (...v: unknown[]) => v.map(s).filter(Boolean).join(' · ');

// Placeholder values seen live in owner/applicant name fields (S1, Nov 2026).
const JUNK: Record<string, true> = { pr: true, na: true, 'n a': true, 'not applicable': true, none: true, owner: true, 'owners rep': true, self: true, unknown: true, tbd: true };
export const companyOrNull = (v: unknown) => {
  const n = s(v);
  const key = n ? normalizeName(n) : '';
  return key.length > 1 && !JUNK[key] ? n : null;
};

export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\b(llc|inc|corp|corporation|co|ltd|company)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export const SOURCES: SodaSource[] = [
  {
    id: 'nyc-dob-permits',
    label: 'NYC DOB building permits',
    state: 'NY',
    endpoint: 'https://data.cityofnewyork.us/resource/rbx6-tga4.json',
    dateField: 'issued_date',
    recordIdField: 'tracking_number', // live: no job__; work_permit repeats across renewals, tracking_number is per issuance
    map: (r) => ({
      companyName: companyOrNull(r.owner_business_name) ?? companyOrNull(r.applicant_business_name),
      date: s(r.issued_date),
      summary: join(r.work_type, r.job_description),
      region: s(r.borough),
      recordId: s(r.tracking_number),
      url: null,
    }),
  },
  {
    id: 'nyc-dob-electrical',
    label: 'NYC DOB electrical permits',
    state: 'NY',
    endpoint: 'https://data.cityofnewyork.us/resource/dm9a-ab7w.json',
    dateField: 'permit_issued_date',
    recordIdField: 'job_filing_number',
    map: (r) => ({
      companyName: companyOrNull(r.firm_name),
      date: s(r.permit_issued_date),
      summary: join(r.job_description),
      region: s(r.borough),
      recordId: s(r.job_filing_number),
      url: null,
    }),
  },
  {
    id: 'austin-permits',
    label: 'Austin issued construction permits',
    state: 'TX',
    endpoint: 'https://data.austintexas.gov/resource/3syk-w9eu.json',
    dateField: 'issue_date',
    recordIdField: 'permit_number',
    where: "permit_class_mapped='Commercial'",
    map: (r) => ({
      companyName: companyOrNull(r.contractor_company_name),
      date: s(r.issue_date),
      summary: join(r.permit_type_desc, r.description),
      region: s(r.original_city),
      recordId: s(r.permit_number),
      url: linkUrl(r.link),
    }),
  },
  {
    id: 'seattle-electrical',
    label: 'Seattle electrical permits',
    state: 'WA',
    endpoint: 'https://cos-data.seattle.gov/resource/c4tj-daue.json',
    dateField: 'issueddate',
    recordIdField: 'permitnum',
    map: (r) => {
      const name = companyOrNull(r.contractorcompanyname);
      return {
        companyName: name && !name.toUpperCase().startsWith('BLANKET:') ? name : null,
        date: s(r.issueddate),
        summary: join(r.description, r.permittypemapped),
        region: s(r.originalcity),
        recordId: s(r.permitnum),
        url: linkUrl(r.link),
      };
    },
  },
];

export const sourceUrl = (src: SodaSource, recordId: string) =>
  `${src.endpoint}?${src.recordIdField}=${encodeURIComponent(recordId)}`;
