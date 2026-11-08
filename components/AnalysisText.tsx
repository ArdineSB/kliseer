'use client';

import { useState } from 'react';

/** AI interpretation paragraph under the rule-based stars. Generated once on demand, then stored. */
export function AnalysisText({ companyId, initial }: { companyId: number; initial: string | null }) {
  const [text, setText] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  async function generate() {
    setBusy(true);
    setError(false);
    const res = await fetch(`/app/api/prospects/${companyId}/analysis`, { method: 'POST' }).catch(() => null);
    setBusy(false);
    const data: unknown = res?.ok ? await res.json().catch(() => null) : null;
    if (!data || typeof data !== 'object' || !('body' in data) || typeof data.body !== 'string') return setError(true);
    setText(data.body);
  }

  return (
    <div className="mt-5" aria-live="polite">
      {text ? (
        <p className="m-0 text-[15px] leading-6">{text}</p>
      ) : busy ? (
        <div className="flex flex-col gap-2" aria-label="Writing interpretation">
          <div className="skeleton w-full" /><div className="skeleton w-11/12" /><div className="skeleton w-2/3" />
        </div>
      ) : (
        <button type="button" className="btn btn-outline" onClick={generate}>Write AI interpretation</button>
      )}
      {error && <p role="alert" className="mt-2 mb-0 text-[13px] text-error">AI is unavailable right now. <button type="button" className="link" onClick={generate}>Retry</button></p>}
      {text && !busy && <button type="button" className="link mt-2 text-xs" onClick={generate}>Regenerate</button>}
    </div>
  );
}
