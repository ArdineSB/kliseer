'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Icon } from './Icon';

export function LoadDemoButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadDemo() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/app/api/seller/demo', { method: 'POST' });
      const result = await res.json().catch(() => null);
      if (!res.ok) throw new Error(typeof result?.error === 'string' ? result.error : 'Could not load demo data. Try again.');
      router.refresh();
    } catch (e) {
      setError((e as Error).message || 'Could not load demo data. Try again.');
      setBusy(false);
    }
  }

  return (
    <div>
      <button type="button" className="btn btn-outline h-9" onClick={loadDemo} disabled={busy} title="Copy the Harborline case study into this blank guest workspace.">
        <Icon name="sparkle" />{busy ? 'Loading…' : 'Load demo data'}
      </button>
      {error && <span role="alert" className="mt-2 block max-w-64 text-xs text-error">{error}</span>}
    </div>
  );
}
