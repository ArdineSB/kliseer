'use client';

import { useEffect } from 'react';

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div style={{ padding: 32, maxWidth: 560 }}>
      <div className="alert" role="alert">
        <span><b>Couldn&apos;t load this page.</b> The database or a source may be unavailable.</span>
        <button type="button" className="btn btn-outline" onClick={() => retry()}>Retry</button>
      </div>
    </div>
  );
}
