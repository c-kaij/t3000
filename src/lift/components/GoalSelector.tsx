import { GOALS, type Goal } from '../types';
import { colors, radii } from '../theme';

export default function GoalSelector({
  goal,
  onChange,
}: {
  goal: Goal;
  onChange: (g: Goal) => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 4,
        background: colors.bgCard,
        border: `1px solid ${colors.border}`,
        borderRadius: radii.md,
        padding: 4,
      }}
    >
      {GOALS.map((g) => {
        const active = g.id === goal;
        return (
          <button
            key={g.id}
            onClick={() => onChange(g.id)}
            style={{
              flex: 1,
              border: 'none',
              borderRadius: radii.sm,
              padding: '8px 4px',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 0.3,
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontFamily: 'inherit',
              background: active ? colors.red : 'transparent',
              color: active ? '#fff' : colors.textMid,
              transition: 'background 0.15s ease',
            }}
          >
            {g.label}
          </button>
        );
      })}
    </div>
  );
}
