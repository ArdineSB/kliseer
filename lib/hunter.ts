export type HunterEmail = {
  value: string;
  type: string | null;
  confidence: number | null;
  firstName: string | null;
  lastName: string | null;
  position: string | null;
  linkedin: string | null;
  sourceUrl: string | null;
};

export type HunterDomain = {
  domain: string | null;
  organization: string | null;
  emails: HunterEmail[];
};

function key(): string {
  const k = process.env.HUNTER_API_KEY;
  if (!k) throw new Error('HUNTER_API_KEY is not set');
  return k;
}

function sourceUrl(sources: unknown): string | null {
  if (!Array.isArray(sources)) return null;
  for (const source of sources) {
    if (source && typeof source === 'object' && 'uri' in source && typeof source.uri === 'string') return source.uri;
  }
  return null;
}

function email(row: unknown): HunterEmail | null {
  if (!row || typeof row !== 'object') return null;
  if (!('value' in row) || typeof row.value !== 'string' || !row.value.includes('@')) return null;
  return {
    value: row.value,
    type: 'type' in row && typeof row.type === 'string' ? row.type : null,
    confidence: 'confidence' in row && typeof row.confidence === 'number' ? row.confidence : null,
    firstName: 'first_name' in row && typeof row.first_name === 'string' ? row.first_name : null,
    lastName: 'last_name' in row && typeof row.last_name === 'string' ? row.last_name : null,
    position: 'position' in row && typeof row.position === 'string' ? row.position : null,
    linkedin: 'linkedin' in row && typeof row.linkedin === 'string' ? row.linkedin : null,
    sourceUrl: 'sources' in row ? sourceUrl(row.sources) : null,
  };
}

/** Paid-path lookup. Kliseer Free tier must not call this. One search credit if emails come back. */
export async function searchCompany(company: string): Promise<HunterDomain> {
  const url = new URL('https://api.hunter.io/v2/domain-search');
  url.searchParams.set('company', company);
  url.searchParams.set('limit', '5');
  url.searchParams.set('api_key', key());
  const res = await fetch(url);
  const body: unknown = await res.json();
  if (!res.ok) throw new Error(`Hunter ${res.status}`);
  const data = body && typeof body === 'object' && 'data' in body && body.data && typeof body.data === 'object' ? body.data : {};
  const rows = 'emails' in data && Array.isArray(data.emails) ? data.emails : [];
  return {
    domain: 'domain' in data && typeof data.domain === 'string' ? data.domain : null,
    organization: 'organization' in data && typeof data.organization === 'string' ? data.organization : null,
    emails: rows.flatMap((row) => {
      const parsed = email(row);
      return parsed ? [parsed] : [];
    }),
  };
}
