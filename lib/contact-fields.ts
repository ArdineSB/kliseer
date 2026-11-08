// Client-safe contact types and validation (no DB imports), like lib/fields.ts.

export type Contact = {
  id: number; companyId: number; company: string; name: string; title: string | null; email: string | null; phone: string | null;
  linkedinUrl: string | null; website: string | null; socialUrl: string | null; sourceUrl: string; manual: boolean;
};
export type ContactInput = Omit<Contact, 'id' | 'company' | 'manual'>;

const URL_KEYS = ['linkedinUrl', 'website', 'socialUrl', 'sourceUrl'] as const;
const httpUrl = (v: string) => { try { return ['http:', 'https:'].includes(new URL(v).protocol); } catch { return false; } };

/** Validate untrusted form input. Every contact keeps a source URL: where the user found it (Q12/Q18). */
export function cleanContact(raw: unknown): { ok: true; value: ContactInput } | { ok: false; error: string } {
  if (!raw || typeof raw !== 'object') return { ok: false, error: 'Invalid contact.' };
  const r: Record<string, unknown> = { ...raw };
  const str = (k: string) => { const x = r[k]; return typeof x === 'string' ? x.trim() : ''; };
  const companyId = Number(r.companyId);
  if (!Number.isInteger(companyId) || companyId <= 0) return { ok: false, error: 'Choose a company.' };
  const v = { name: str('name'), title: str('title'), email: str('email').toLowerCase(), phone: str('phone'), linkedinUrl: str('linkedinUrl'), website: str('website'), socialUrl: str('socialUrl'), sourceUrl: str('sourceUrl') };
  if (!v.name) return { ok: false, error: 'Enter a name.' };
  if (Object.values(v).some((x) => x.length > 500)) return { ok: false, error: 'Fields are limited to 500 characters.' };
  if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) return { ok: false, error: 'Enter a valid email.' };
  if (v.phone && !(/^\+?[\d\s().-]+$/.test(v.phone) && v.phone.replace(/\D/g, '').length >= 7)) return { ok: false, error: 'Enter a valid phone number.' };
  if (!v.sourceUrl) return { ok: false, error: 'Add the source URL where you found this contact.' };
  for (const k of URL_KEYS) if (v[k] && !httpUrl(v[k])) return { ok: false, error: 'Links must start with http:// or https://.' };
  const n = (x: string) => x || null;
  return { ok: true, value: { companyId, name: v.name, title: n(v.title), email: n(v.email), phone: n(v.phone), linkedinUrl: n(v.linkedinUrl), website: n(v.website), socialUrl: n(v.socialUrl), sourceUrl: v.sourceUrl } };
}
