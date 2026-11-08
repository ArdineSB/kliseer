'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Contact = { id: number; name: string };
type Props = {
  companyId: number;
  companyName: string;
  contacts: Contact[];
  draft: { subject: string; body: string } | null;
};

/**
 * Draft email panel (Q8). Stored text keeps {contact.name}; the chosen contact replaces it
 * at display. Generate calls the LLM with real signals; Save writes the token text back.
 */
export function DraftPanel({ companyId, companyName, contacts, draft }: Props) {
  const router = useRouter();
  const [contactId, setContactId] = useState<number | null>(contacts[0]?.id ?? null);
  const [subject, setSubject] = useState(draft?.subject ?? '');
  const [body, setBody] = useState(draft?.body ?? '');
  const [status, setStatus] = useState<'empty' | 'generating' | 'saved' | 'error'>('empty');
  const [error, setError] = useState<string | null>(null);

  const contact = contacts.find((c) => c.id === contactId) ?? null;
  // Display replacement: token → chosen name, one pass. Edits keep the raw text.
  const render = (t: string) => (contact ? t.replaceAll('{contact.name}', contact.name) : t.replaceAll('{contact.name}', companyName));
  const hasDraft = subject.trim() !== '' || body.trim() !== '';

  async function onGenerate() {
    if (!contact) return;
    setStatus('generating');
    setError(null);
    try {
      const res = await fetch(`/app/api/prospects/${companyId}/draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactId: contact.id }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error ?? 'generate failed');
      const data = (await res.json()) as { subject: string; body: string };
      setSubject(data.subject);
      setBody(data.body);
      setStatus('saved');
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
      setStatus('error');
    }
  }

  async function onSave() {
    setStatus('generating');
    setError(null);
    try {
      const res = await fetch(`/app/api/prospects/${companyId}/draft`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, body }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error ?? 'save failed');
      setStatus('saved');
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
      setStatus('error');
    }
  }

  return (
    <section className="card" style={{ marginTop: 16 }} aria-labelledby="email-draft">
      <div className="card-head">
        <h2 id="email-draft" style={{ fontSize: 14 }}>Email draft</h2>
        {status === 'saved' && <span className="save-status ok" role="status">Saved</span>}
        {status === 'generating' && <span className="save-status" role="status">Working…</span>}
      </div>
      <div className="card-body">
        {contacts.length === 0 ? (
          <p className="muted" style={{ margin: 0 }}>Add a contact before generating a draft.</p>
        ) : (
          <>
            <div className="field" style={{ marginBottom: 12, maxWidth: 320 }}>
              <label htmlFor="draft-contact">Recipient</label>
              <select id="draft-contact" value={contactId ?? ''} onChange={(e) => setContactId(Number(e.target.value))} disabled={status === 'generating'}>
                {contacts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            {!hasDraft ? (
              <button type="button" className="btn btn-primary" onClick={onGenerate} disabled={!contact || status === 'generating'}>
                {status === 'generating' ? 'Generating…' : 'Generate'}
              </button>
            ) : (
              <>
                <div className="field" style={{ marginBottom: 12 }}>
                  <label htmlFor="draft-subject">Subject</label>
                  <input id="draft-subject" value={subject} onChange={(e) => setSubject(e.target.value)} disabled={status === 'generating'} />
                  <span className="muted" style={{ fontSize: 12 }}>{render(subject)}</span>
                </div>
                <div className="field" style={{ marginBottom: 12 }}>
                  <label htmlFor="draft-body">Body</label>
                  <textarea id="draft-body" style={{ height: 200 }} value={body} onChange={(e) => setBody(e.target.value)} disabled={status === 'generating'} />
                  <span className="muted" style={{ fontSize: 12, whiteSpace: 'pre-wrap' }}>{render(body)}</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="button" className="btn btn-outline" onClick={onGenerate} disabled={!contact || status === 'generating'}>
                    {status === 'generating' ? 'Generating…' : 'Regenerate'}
                  </button>
                  <button type="button" className="btn btn-primary" onClick={onSave} disabled={status === 'generating'}>
                    Save changes
                  </button>
                </div>
              </>
            )}
            {error && <p role="alert" style={{ color: 'var(--status-error)', fontSize: 13, margin: '12px 0 0' }}>{error}</p>}
          </>
        )}
      </div>
    </section>
  );
}
