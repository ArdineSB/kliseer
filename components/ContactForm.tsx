'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Company = { id: number; name: string; state?: string };
const FIELDS = [
  { key: 'name', label: 'Name', required: true, type: 'text', placeholder: 'Full name or company contact' },
  { key: 'title', label: 'Job title', type: 'text', placeholder: 'Operations Manager' },
  { key: 'email', label: 'Email', type: 'email', placeholder: 'name@company.com' },
  { key: 'phone', label: 'Phone', type: 'tel', placeholder: '(718) 555-0100' },
  { key: 'linkedinUrl', label: 'LinkedIn URL', type: 'url', placeholder: 'https://www.linkedin.com/in/…' },
  { key: 'website', label: 'Website', type: 'url', placeholder: 'https://company.com' },
  { key: 'socialUrl', label: 'Social URL', type: 'url', placeholder: 'https://…' },
  { key: 'sourceUrl', label: 'Source URL', required: true, type: 'url', placeholder: 'Where you found this contact', hint: 'Required. Kliseer shows it next to the contact.' },
] as const;

const input = 'h-10 rounded-lg border border-input bg-canvas px-3 focus:outline-2 focus:-outline-offset-1 focus:outline-[var(--focus-ring)]';

/** Manual contact entry. `company` fixed = detail page; omitted = /contacts with a company picker. */
export function ContactForm({ company, onDone }: { company?: Company; onDone: () => void }) {
  const router = useRouter();
  const [picked, setPicked] = useState<Company | null>(company ?? null);
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState<Company[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function search(q: string) {
    setQuery(q);
    setPicked(null);
    if (q.trim().length < 2) return setOptions([]);
    const res = await fetch(`/app/api/contacts?company=${encodeURIComponent(q)}`).catch(() => null);
    setOptions(res?.ok ? await res.json() : []);
  }

  async function submit(form: HTMLFormElement) {
    if (!picked) return setError('Choose a company.');
    setBusy(true);
    setError(null);
    const data = Object.fromEntries(new FormData(form));
    const res = await fetch('/app/api/contacts', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...data, companyId: picked.id }) }).catch(() => null);
    setBusy(false);
    if (!res?.ok) return setError((await res?.json().catch(() => null))?.error ?? 'Could not save the contact. Try again.');
    form.reset();
    onDone();
    router.refresh();
  }

  return (
    <form className="rounded-xl border border-line bg-canvas p-5" onSubmit={(e) => { e.preventDefault(); submit(e.currentTarget); }} aria-labelledby="contact-form-title">
      <h3 id="contact-form-title" className="m-0 text-[15px] font-semibold">Add contact manually</h3>
      <p className="mt-1 mb-4 text-xs text-secondary">Saved to your workspace only. Kliseer does not verify manual entries.</p>
      <div className="grid grid-cols-2 gap-4">
        {!company && (
          <div className="relative col-span-2 flex flex-col gap-1.5">
            <label htmlFor="contact-company" className="text-xs text-label">Company <span aria-hidden="true">*</span></label>
            <input
              id="contact-company" className={input} autoComplete="off" required role="combobox" aria-expanded={options.length > 0 && !picked} aria-controls="contact-company-list"
              value={picked ? picked.name : query} placeholder="Search prospects by name" onChange={(e) => search(e.target.value)}
            />
            {options.length > 0 && !picked && (
              <ul id="contact-company-list" role="listbox" className="absolute top-full z-10 mt-1 max-h-60 w-full list-none overflow-auto rounded-lg border border-line bg-canvas p-1 shadow-md">
                {options.map((o) => (
                  <li key={o.id} role="option" aria-selected={false}>
                    <button type="button" className="w-full cursor-pointer rounded-md border-0 bg-transparent px-3 py-2 text-left hover:bg-subtle" onClick={() => { setPicked(o); setOptions([]); }}>
                      {o.name} <span className="text-xs text-muted">{o.state}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {FIELDS.map((f) => (
          <div key={f.key} className={`flex flex-col gap-1.5 ${f.key === 'sourceUrl' ? 'col-span-2' : ''}`}>
            <label htmlFor={`contact-${f.key}`} className="text-xs text-label">{f.label}{'required' in f && <span aria-hidden="true"> *</span>}</label>
            <input id={`contact-${f.key}`} name={f.key} type={f.type} className={input} placeholder={f.placeholder} required={'required' in f} maxLength={500} />
            {'hint' in f && <span className="text-xs text-muted">{f.hint}</span>}
          </div>
        ))}
      </div>
      {error && <p role="alert" className="mt-4 mb-0 text-[13px] text-error">{error}</p>}
      <div className="mt-5 flex justify-end gap-2">
        <button type="button" className="btn btn-ghost" onClick={onDone} disabled={busy}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save contact'}</button>
      </div>
    </form>
  );
}
