import type { Tier } from '@/lib/tier';

const LABEL: Record<Tier, string> = { S: 'Tier S', A: 'Tier A', B: 'Tier B', C: 'Tier C', '—': 'Tier unavailable' };

export function TierBadge({ tier }: { tier: Tier }) {
  return <span className={`tier tier-${tier}`} role="img" aria-label={LABEL[tier]} title={LABEL[tier]}>{tier}</span>;
}
