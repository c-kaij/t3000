import type { Exercise, Goal } from '../types';
import { colors, radii } from '../theme';
import TierBadge from './TierBadge';

export default function ExerciseListItem({
  exercise,
  goal,
  onSelect,
}: {
  exercise: Exercise;
  goal: Goal;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: colors.bgCard,
        border: `1px solid ${colors.border}`,
        borderRadius: radii.md,
        padding: '10px 12px',
        cursor: 'pointer',
        fontFamily: 'inherit',
        textAlign: 'left',
      }}
    >
      <TierBadge tier={exercise.tiers[goal]} size="md" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: colors.text }}>{exercise.name}</div>
        <div
          style={{
            fontSize: 12,
            color: colors.textSoft,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {exercise.category}
        </div>
      </div>
      <span style={{ color: colors.textSoft, fontSize: 18 }}>›</span>
    </button>
  );
}
