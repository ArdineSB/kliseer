// Client-safe seller field schema and validation (no DB imports).

export type Section = 'company' | 'icp' | 'target';
export const SECTIONS: Section[] = ['company', 'icp', 'target'];
export type Status = 'draft' | 'approved';
export type FieldValue = string | string[];
export type Seller = {
  id: number;
  company: Record<string, FieldValue>;
  icp: Record<string, FieldValue>;
  target: Record<string, FieldValue>;
  status: Record<Section, Status>;
  sources: Record<string, number>; // "<section>.<field>" → chat_messages.id
};
export type Field = { key: string; label: string; list: boolean; wide?: boolean; placeholder?: string; hint?: string };

/** Editable fields per section, with labels for UI and LLM prompts. Lists are comma-separated in the UI. */
export const FIELDS: Record<Section, Field[]> = {
  company: [
    { key: 'name', label: 'Company name', list: false, placeholder: 'Your company' },
    { key: 'website', label: 'Website', list: false, placeholder: 'example.com' },
    { key: 'products', label: 'Products and services', list: true, wide: true, placeholder: 'Standby generators, switchboards…' },
    { key: 'customerSegments', label: 'Customer segments', list: true, placeholder: 'General contractors…' },
    { key: 'existingCustomers', label: 'Existing customers', list: true, placeholder: 'Regional GCs…' },
    { key: 'region', label: 'Service region', list: true, placeholder: 'NY, NJ', hint: 'State codes. Prospects elsewhere are flagged, not hidden.' },
    { key: 'priceRange', label: 'Price range', list: false, placeholder: 'Typical order size' },
    { key: 'keywords', label: 'Signal keywords', list: true, wide: true, placeholder: 'switchboard, generator…', hint: 'Matched against permit descriptions to rank prospects.' },
  ],
  icp: [
    { key: 'industry', label: 'Industry', list: true, placeholder: 'Building construction, specialty trade' },
    { key: 'companySize', label: 'Company size', list: false, placeholder: '20–500 employees' },
    { key: 'region', label: 'Region', list: true, placeholder: 'NY, NJ' },
    { key: 'eventTypes', label: 'Relevant events', list: true, placeholder: 'Permits, facility expansions' },
  ],
  target: [
    { key: 'companyTypes', label: 'Company types', list: true, placeholder: 'General and electrical contractors' },
    { key: 'regions', label: 'Regions', list: true, placeholder: 'New York, New Jersey' },
    { key: 'buyerRoles', label: 'Buyer roles', list: true, wide: true, placeholder: 'Procurement, project managers' },
  ],
};

/** Validate untrusted input: known keys only, strings ≤ 500 chars, lists ≤ 50 items. */
export function cleanFields(section: Section, data: unknown): { ok: true; value: Record<string, FieldValue> } | { ok: false; error: string } {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return { ok: false, error: 'data must be an object' };
  const out: Record<string, FieldValue> = {};
  for (const [k, v] of Object.entries(data)) {
    const f = FIELDS[section].find((x) => x.key === k);
    if (!f) return { ok: false, error: `unknown field ${section}.${k}` };
    if (f.list) {
      if (!Array.isArray(v) || v.length > 50 || !v.every((i) => typeof i === 'string' && i.length <= 500)) return { ok: false, error: `${f.label}: at most 50 items of 500 characters` };
      out[k] = v.map((i: string) => i.trim()).filter(Boolean);
    } else {
      if (typeof v !== 'string' || v.length > 500) return { ok: false, error: `${f.label}: at most 500 characters` };
      out[k] = v.trim();
    }
  }
  return { ok: true, value: out };
}
