export default function Loading() {
  return (
    <div className="shell">
      <div />
      <main className="panel" aria-busy="true" aria-label="Loading prospects">
        <div className="topbar" />
        <div className="content" style={{ display: 'grid', gap: 16 }}>
          <div className="skeleton" style={{ width: 200, height: 28 }} />
          <div className="skeleton" style={{ height: 92 }} />
          {Array.from({ length: 8 }, (_, i) => <div key={i} className="skeleton" style={{ height: 44 }} />)}
        </div>
      </main>
    </div>
  );
}
