import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLibrary } from './library';
import { GOALS, type Goal } from './types';
import { colors, radii, spacing } from './theme';
import GoalSelector from './components/GoalSelector';
import ExerciseListItem from './components/ExerciseListItem';

export default function Home({
  goal,
  onGoalChange,
}: {
  goal: Goal;
  onGoalChange: (g: Goal) => void;
}) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { exercises } = useLibrary();

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? exercises.filter(
          (e) => e.name.toLowerCase().includes(q) || e.category.toLowerCase().includes(q),
        )
      : exercises;

    const groups = new Map<string, typeof exercises>();
    for (const exercise of filtered) {
      const list = groups.get(exercise.category) ?? [];
      list.push(exercise);
      groups.set(exercise.category, list);
    }
    return Array.from(groups.entries());
  }, [query, exercises]);

  const activeGoal = GOALS.find((g) => g.id === goal)!;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.lg,
        padding: spacing.lg,
        paddingBottom: spacing.xxl,
      }}
    >
      <div>
        <h1
          style={{
            margin: 0,
            fontSize: 26,
            fontWeight: 900,
            letterSpacing: -0.5,
            color: colors.text,
          }}
        >
          Exercise <span style={{ color: colors.red }}>Tiers</span>
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: colors.textSoft }}>
          Pick a training goal, then pick an exercise.
        </p>
      </div>

      <GoalSelector goal={goal} onChange={onGoalChange} />
      <p style={{ margin: 0, fontSize: 12, color: colors.textSoft }}>{activeGoal.blurb}</p>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search exercises…"
          style={{
            flex: 1,
            minWidth: 0,
            background: colors.bgCard,
            border: `1px solid ${colors.border}`,
            borderRadius: radii.md,
            padding: '10px 14px',
            color: colors.text,
            fontSize: 15,
            fontFamily: 'inherit',
            outline: 'none',
          }}
        />
        <button
          onClick={() => navigate(query ? `/add?q=${encodeURIComponent(query)}` : '/add')}
          aria-label="Add an exercise"
          style={{
            width: 44,
            flexShrink: 0,
            background: colors.red,
            border: 'none',
            borderRadius: radii.md,
            color: '#fff',
            fontSize: 22,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          +
        </button>
      </div>

      {grouped.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ color: colors.textSoft, fontSize: 14, margin: 0 }}>
            No exercises match "{query}".
          </p>
          <button
            onClick={() => navigate(`/add?q=${encodeURIComponent(query)}`)}
            style={{
              alignSelf: 'flex-start',
              background: 'none',
              border: 'none',
              color: colors.red,
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              padding: 0,
            }}
          >
            + Add "{query}" as a new exercise
          </button>
        </div>
      )}

      {grouped.map(([category, list]) => (
        <div key={category} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0.6,
              textTransform: 'uppercase',
              color: colors.textSoft,
            }}
          >
            {category}
          </div>
          {list.map((exercise) => (
            <ExerciseListItem
              key={exercise.id}
              exercise={exercise}
              goal={goal}
              onSelect={() => navigate(`/exercise/${exercise.id}`)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
