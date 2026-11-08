'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

/** POST /api/auth/logout then drop to the guest path (same visitor keeps guest data). */
export function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      className="btn btn-outline"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await fetch('/api/auth/logout', { method: 'POST' }).catch(() => null);
        router.push('/');
        router.refresh();
      }}
    >
      Log out
    </button>
  );
}
