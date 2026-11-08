'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { FIELDS, type FieldValue, type Section, type Seller } from '@/lib/fields';
import { UploadFiles } from './UploadFiles';
import { Topbar } from './Topbar';

type Props = { section: Section; seller: Seller; crumbs: string[]; chatHref: string; next: string; back?: string; head: ReactNode };
type Save = 'idle' | 'saving' | 'error';

const toText = (v: FieldValue | undefined) => (Array.isArray(v) ? v.join(', ') : v ?? '');

export function SetupForm({ section, seller, crumbs, chatHref, next, back, head }: Props) {
  const router = useRouter();
  const fields = FIELDS[section];
  const fromServer = () => Object.fromEntries(fields.map((f) => [f.key, toText(seller[section][f.key])]));
  const [values, setValues] = useState<Record<string, string>>(fromServer);
  const [dirty, setDirty] = useState(false);
  const [save, setSave] = useState<Save>('idle');
  const [error, setError] = useState<string | null>(null);

  // Chat drafts arrive via router.refresh(); take them unless the user has unsaved edits (sync during render, no effect).
  const serverKey = JSON.stringify(seller[section]);
  const [seenKey, setSeenKey] = useState(serverKey);
  if (serverKey !== seenKey) {
    setSeenKey(serverKey);
    if (!dirty) setValues(fromServer());
  }

  const fromChat = (key: string) => seller.sources[`${section}.${key}`];
  const filled = fields.some((f) => toText(seller[section][f.key]));

  async function onContinue() {
    setSave('saving');
    setError(null);
    const data = Object.fromEntries(fields.map((f) => {
      const v = values[f.key] ?? '';
      return [f.key, f.list ? v.split(',').map((s) => s.trim()).filter(Boolean) : v.trim()];
    }));
    // Only send changed fields so untouched "From chat" markers survive.
    const changed = Object.fromEntries(Object.entries(data).filter(([k, v]) => JSON.stringify(v) !== JSON.stringify(seller[section][k] ?? (Array.isArray(v) ? [] : ''))));
    try {
      if (Object.keys(changed).length) {
        const res = await fetch('/api/seller', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ section, data: changed }) });
        if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? 'Could not save. Check your connection and try again.');
      }
      setDirty(false);
      setSave('idle');
      router.push(next);
      router.refresh();
    } catch (e) {
      setSave('error');
      setError((e as Error).message);
    }
  }

  const status = save === 'saving' ? <span className="save-status" role="status">Saving…</span>
    : save === 'error' ? <span className="save-status err" role="status">Not saved</span>
    : dirty ? <span className="save-status" role="status">Unsaved changes</span>
    : filled ? <span className="save-status ok" role="status">Saved</span>
    : <span className="save-status" role="status">Draft</span>;

  return (
    <>
      <Topbar crumbs={crumbs} right={status} />
      <div className="content">
        {head}
        <div className="form-head">
          <div />
          {fields.some((f) => fromChat(f.key)) && <span className="legend"><i className="from-chat" aria-hidden="true" /> From chat</span>}
        </div>
        {error && <div className="alert" role="alert" style={{ maxWidth: 640, marginBottom: 16 }}>{error}<button type="button" className="link" onClick={onContinue}>Retry</button></div>}
        <form className="form" id="setup-form" onSubmit={(e) => { e.preventDefault(); onContinue(); }}>
          {fields.map((f) => {
            const src = fromChat(f.key);
            const id = `${section}-${f.key}`;
            const hint = [f.hint, f.list && 'Separate with commas.'].filter(Boolean).join(' ');
            const onChange = (v: string) => { setValues({ ...values, [f.key]: v }); setDirty(true); };
            return (
              <div key={f.key} className={`field${f.wide ? ' wide' : ''}`}>
                <label htmlFor={id}>
                  {f.label}
                  {src && <Link href={`${chatHref}#msg-${src}`} className="from-chat" aria-label={`${f.label}: from chat, show message`} title="From chat" />}
                </label>
                {f.wide
                  ? <textarea id={id} value={values[f.key] ?? ''} placeholder={f.placeholder} maxLength={2000} aria-describedby={hint ? `${id}-hint` : undefined} onChange={(e) => onChange(e.target.value)} />
                  : <input id={id} value={values[f.key] ?? ''} placeholder={f.placeholder} maxLength={f.list ? 2000 : 500} aria-describedby={hint ? `${id}-hint` : undefined} onChange={(e) => onChange(e.target.value)} />}
                {hint && <span className="hint" id={`${id}-hint`}>{hint}</span>}
              </div>
            );
          })}
        </form>
        {section === 'company' && <UploadFiles />}
      </div>
      <footer className="footer">
        {back && <Link href={back} className="btn btn-ghost">Back</Link>}
        <span className="spacer" />
        <button type="submit" form="setup-form" className="btn btn-primary" disabled={save === 'saving'}>Continue</button>
      </footer>
    </>
  );
}
