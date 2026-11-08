'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Icon } from './Icon';

type Props = { variant: 'topbar' | 'sidebar' };

export function NewChatButton({ variant }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startChat() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/app/api/chat/threads', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ tab: 'home' }),
      });
      const result: unknown = await res.json().catch(() => null);
      if (!res.ok || !result || typeof result !== 'object' || !('threadId' in result) || typeof result.threadId !== 'string') {
        throw new Error('Could not start a new chat. Try again.');
      }
      router.push(`/?thread=${encodeURIComponent(result.threadId)}`);
      setBusy(false);
    } catch (e) {
      setError((e as Error).message || 'Could not start a new chat. Try again.');
      setBusy(false);
    }
  }

  const style = variant === 'sidebar'
    ? 'gradient-border mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-full text-[13px] font-medium text-brand disabled:cursor-wait disabled:opacity-60'
    : 'flex h-9 items-center gap-2 rounded-full border border-line px-4 text-[13px] font-medium hover:bg-subtle disabled:cursor-wait disabled:opacity-60';

  return (
    <div>
      <button type="button" className={style} onClick={startChat} disabled={busy}>
        <Icon name="plus" />{busy ? 'Starting…' : 'New chat'}
      </button>
      {error && <span className="mt-2 block text-xs text-error" role="alert">{error}</span>}
    </div>
  );
}
