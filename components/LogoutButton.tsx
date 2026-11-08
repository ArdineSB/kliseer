'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Icon } from './Icon';

/** POST /api/auth/logout then drop to the guest path (same visitor keeps guest data). */
export function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      className="nav-item w-full cursor-pointer bg-transparent text-left"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await fetch('/api/auth/logout', { method: 'POST' }).catch(() => null);
        router.push('/');
        router.refresh();
      }}
    >
      <Icon name="logOut" />Log out
    </button>
  );
}
