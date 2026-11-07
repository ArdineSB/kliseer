import type { ReactNode } from 'react';

export function Topbar({ crumbs, right }: { crumbs: string[]; right?: ReactNode }) {
  return (
    <header className="topbar">
      <nav aria-label="Breadcrumb" className="crumbs">
        {crumbs.map((c, i) => (
          <span key={i} style={{ display: 'contents' }}>
            {i > 0 && <span aria-hidden="true">/</span>}
            {i === crumbs.length - 1 ? <b aria-current="page">{c}</b> : <span>{c}</span>}
          </span>
        ))}
      </nav>
      {right}
    </header>
  );
}
