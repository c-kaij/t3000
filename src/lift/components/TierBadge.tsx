import type { Tier } from '../types';
import { tierColors } from '../theme';

export default function TierBadge({
  tier,
  size = 'md',
  dim = false,
}: {
  tier: Tier;
  size?: 'sm' | 'md' | 'lg';
  dim?: boolean;
}) {
  const dims = { sm: 26, md: 34, lg: 48 }[size];
  const fontSize = { sm: 13, md: 16, lg: 22 }[size];
  const color = tierColors[tier];

  return (
    <div
      style={{
        width: dims,
        height: dims,
        borderRadius: dims / 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: dim ? 'transparent' : color,
        border: `2px solid ${color}`,
        color: dim ? color : '#0b0b0d',
        fontWeight: 800,
        fontSize,
        opacity: dim ? 0.55 : 1,
        flexShrink: 0,
      }}
    >
      {tier}
    </div>
  );
}
