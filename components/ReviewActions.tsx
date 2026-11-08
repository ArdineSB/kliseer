'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Section } from '@/lib/fields';

export function ApproveButton({ section, label }: { section: Section; label: string }) {
  const router = useRouter();
  const [state, setState] = useState<'idle' | 'saving' | 'error'>('idle');
  async function approve() {
    setState('saving');
    const res = await fetch('/app/api/seller', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ section, data: {}, approve: true }) }).catch(() => null);
    if (!res?.ok) return setState('error');
    setState('idle');
    router.refresh();
  }
  return (
    <>
      <button type="button" className="btn btn-outline" onClick={approve} disabled={state === 'saving'}>{state === 'saving' ? 'Approving…' : `Approve ${label}`}</button>
      {state === 'error' && <p role="alert" className="save-status err" style={{ margin: '8px 0 0' }}>Not saved. Try again.</p>}
    </>
  );
}

export function FindProspects({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  return (
    <button type="button" className="btn btn-primary" disabled={!enabled} aria-describedby={enabled ? undefined : 'fp-why'} onClick={() => router.push('/seer')}>
      Find prospects
      {!enabled && <span id="fp-why" className="sr-only">Approve all three sections first.</span>}
    </button>
  );
}
