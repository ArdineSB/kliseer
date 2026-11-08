'use client';

import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { useRouter } from 'next/navigation';

const MAX_BYTES = 2 * 1024 * 1024;
const OK_EXT = ['pdf', 'md', 'txt', 'markdown'];
const fmtSize = (n: number) => (n < 1024 ? `${n} B` : n < 1024 * 1024 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`);

type Row = { name: string; size: number; status: 'reading' | 'ready' | 'error'; error?: string };
type Field = { section: string; field: string; value: string | string[]; quote: string; fileName: string };

/**
 * Multi-file upload panel (DESIGN.md contract): per-file status table, per-file retry/remove,
 * failures never cancel the batch, drafts saved server-side with quotes + file attribution.
 * The original file is never persisted.
 */
export function UploadFiles() {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);

  async function send(list: FileList | File[]) {
    const picked = Array.from(list);
    // 2 MiB and extension validated client-side per file; the server re-checks.
    const valid = picked.filter((f) => OK_EXT.includes(f.name.split('.').pop()?.toLowerCase() ?? '') && f.size <= MAX_BYTES);
    const invalid = picked.filter((f) => !valid.includes(f));
    const newRows: Row[] = [
      ...valid.map((f) => ({ name: f.name, size: f.size, status: 'reading' as const })),
      ...invalid.map((f) => ({ name: f.name, size: f.size, status: 'error' as const, error: 'Could not read that file.' })),
    ];
    setRows((prev) => [...prev, ...newRows]);
    if (!valid.length) return;
    setBusy(true);
    try {
      const body = new FormData();
      for (const f of valid) body.append('files', f);
      const res = await fetch('/app/api/upload', { method: 'POST', body });
      const data = (await res.json().catch(() => ({}))) as { files?: { name: string; size: number; status: 'ready' | 'error'; error?: string; fields?: Field[] }[] };
      setRows((prev) => prev.map((r) => {
        if (r.status !== 'reading') return r;
        const done = data.files?.find((f) => f.name === r.name && f.size === r.size);
        return done ? { ...r, status: done.status, error: done.error } : { ...r, status: 'error', error: 'Could not read that file.' };
      }));
      const got = data.files?.flatMap((f) => f.fields ?? []) ?? [];
      if (got.length) {
        setFields((prev) => [...prev, ...got]);
        router.refresh(); // Drafts landed server-side; the form shows them.
      }
    } finally {
      setBusy(false);
    }
  }

  function onPick(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) void send(e.target.files);
    e.target.value = '';
  }
  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) void send(e.dataTransfer.files);
  }
  function remove(row: Row) {
    setRows((prev) => prev.filter((r) => r !== row));
  }
  async function retry(row: Row) {
    // Only failed rows retry; user re-picks the file (the original was never stored).
    setRows((prev) => prev.filter((r) => r !== row));
    input.current?.click();
  }

  return (
    <section className="card" style={{ marginTop: 24 }} aria-labelledby="upload-files">
      <div className="card-head"><h2 id="upload-files" style={{ fontSize: 14 }}>Upload files</h2><span className="muted" style={{ fontSize: 12 }}>PDF, MD or TXT · up to 2 MB each</span></div>
      <div className="card-body">
        <div
          className="dropzone"
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          style={{
            border: `1px dashed ${dragging ? 'var(--action-primary)' : 'var(--border-input)'}`,
            borderRadius: 10, padding: '28px 20px', textAlign: 'center', background: 'var(--surface-subtle)',
          }}
        >
          <p style={{ margin: '0 0 12px' }}>Drag files here, or</p>
          <button type="button" className="btn btn-outline" onClick={() => input.current?.click()} disabled={busy}>Choose files</button>
          <input ref={input} type="file" multiple accept=".pdf,.md,.markdown,.txt" onChange={onPick} hidden />
        </div>

        {rows.length > 0 && (
          <table style={{ marginTop: 16, width: '100%' }}>
            <thead>
              <tr><th scope="col">Name</th><th scope="col">Status</th><th scope="col" style={{ textAlign: 'right' }}>Size</th><th scope="col">Action</th></tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={`${r.name}-${i}`}>
                  <td className="clamp">{r.name}</td>
                  <td>{r.status === 'reading' ? <span className="muted">Reading…</span> : r.status === 'ready' ? <span style={{ color: 'var(--status-success)' }}>Ready</span> : <span style={{ color: 'var(--status-error)' }}>{r.error}</span>}</td>
                  <td className="num" style={{ textAlign: 'right' }}>{fmtSize(r.size)}</td>
                  <td>
                    {r.status === 'error'
                      ? <span style={{ display: 'inline-flex', gap: 8 }}><button type="button" className="link" onClick={() => retry(r)}>Choose again</button><button type="button" className="link" onClick={() => remove(r)}>Remove</button></span>
                      : r.status === 'reading' ? <span className="muted">—</span> : <button type="button" className="link" onClick={() => remove(r)}>Remove</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {fields.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <h3 style={{ fontSize: 13, margin: '0 0 8px' }}>Extracted drafts</h3>
            {fields.map((f, i) => (
              <div key={i} style={{ padding: '8px 0', borderTop: '1px solid var(--border-row)' }}>
                <b>{f.field}</b> <span className="muted" style={{ fontSize: 12 }}>from {f.fileName}</span>
                <div style={{ fontSize: 13, margin: '4px 0' }}>{Array.isArray(f.value) ? f.value.join(', ') : f.value}</div>
                <div className="muted" style={{ fontSize: 12 }}>&ldquo;{f.quote}&rdquo;</div>
              </div>
            ))}
            <p className="muted" style={{ fontSize: 12 }}>Saved as drafts. Review them in the form below — nothing is approved automatically.</p>
          </div>
        )}
      </div>
    </section>
  );
}
