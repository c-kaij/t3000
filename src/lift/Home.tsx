import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EXERCISES } from './data/exercises';
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

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? EXERCISES.filter(
          (e) => e.name.toLowerCase().includes(q) || e.category.toLowerCase().includes(q),
        )
      : EXERCISES;

    const groups = new Map<string, typeof EXERCISES>();
    for (const exercise of filtered) {
      const list = groups.get(exercise.category) ?? [];
      list.push(exercise);
      groups.set(exercise.category, list);
    }
    return Array.from(groups.entries());
  }, [query]);

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

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search exercises…"
        style={{
          width: '100%',
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

      {grouped.length === 0 && (
        <p style={{ color: colors.textSoft, fontSize: 14 }}>No exercises match "{query}".</p>
      )}

      {grouped.map(([category, exercises]) => (
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
          {exercises.map((exercise) => (
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
