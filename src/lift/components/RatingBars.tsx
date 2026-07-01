import type { RatingBreakdown } from '../types';
import { colors } from '../theme';

const ROWS: { key: keyof RatingBreakdown; label: string }[] = [
  { key: 'strengthCarryover', label: 'Strength Carryover' },
  { key: 'muscleBuilding', label: 'Muscle Building' },
  { key: 'technicalDifficulty', label: 'Technical Difficulty' },
  { key: 'recoveryCost', label: 'Recovery Cost' },
];

function Stars({ value }: { value: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          style={{
            fontSize: 15,
            color: i < value ? colors.red : colors.border,
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function RatingBars({ ratings }: { ratings: RatingBreakdown }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {ROWS.map((row) => (
        <div
          key={row.key}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 13, color: colors.textMid, fontWeight: 600 }}>
            {row.label}
          </span>
          <Stars value={ratings[row.key]} />
        </div>
      ))}
    </div>
  );
}
