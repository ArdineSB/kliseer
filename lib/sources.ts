type Row = Record<string, unknown>;
export type Mapped = { companyName: string | null; date: string | null; summary: string; region: string | null; recordId: string | null };

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
    }),
  },
];

export const sourceUrl = (src: SodaSource, recordId: string) =>
  `${src.endpoint}?${src.recordIdField}=${encodeURIComponent(recordId)}`;
