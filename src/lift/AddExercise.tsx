import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLibrary } from './library';
import { matchExercises, confidenceLabel } from './search';
import { inferExercise } from './generate';
import { colors, cardStyle, radii, spacing } from './theme';
import SectionHeader from './components/SectionHeader';

export default function AddExercise() {
  const navigate = useNavigate();
  const { exercises, addExercise } = useLibrary();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  const matches = useMemo(() => matchExercises(query, exercises), [query, exercises]);

  const preview = useMemo(() => {
    if (!query.trim()) return null;
    const existingIds = new Set(exercises.map((e) => e.id));
    return inferExercise(query, existingIds);
  }, [query, exercises]);

  const handleAdd = () => {
    if (!preview) return;
    addExercise(preview.exercise, preview.movement);
    navigate(`/exercise/${preview.exercise.id}`);
  };

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
      <button
        onClick={() => navigate('/')}
        style={{
          alignSelf: 'flex-start',
          background: 'none',
          border: 'none',
          color: colors.textMid,
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'inherit',
          padding: 0,
        }}
      >
        ‹ All exercises
      </button>

      <div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, letterSpacing: -0.5, color: colors.text }}>
          Add an Exercise
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: colors.textSoft, lineHeight: 1.4 }}>
          Describe the exercise you mean — a name, a nickname, or how it's done. We'll match it to
          an exercise already in your list, or add it as a new one.
        </p>
      </div>

      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder='e.g. "RDL", "the squat where you hold a dumbbell at your chest", "cable thing for rear shoulders"'
        rows={3}
        style={{
          width: '100%',
          resize: 'vertical',
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

      {query.trim() && (
        <>
          {matches.length > 0 && (
            <div style={cardStyle}>
              <SectionHeader icon="🔎" title="Looks like you mean" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {matches.map(({ exercise, score }) => (
                  <div
                    key={exercise.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 10,
                      border: `1px solid ${colors.border}`,
                      borderRadius: radii.md,
                      padding: '10px 12px',
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: colors.text }}>
                        {exercise.name}
                      </div>
                      <div style={{ fontSize: 12, color: colors.textSoft, marginTop: 2 }}>
                        {exercise.category} · {confidenceLabel(score)}
                      </div>
                      <div style={{ fontSize: 12, color: colors.textMid, marginTop: 4 }}>
                        {exercise.tagline}
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/exercise/${exercise.id}`)}
                      style={{
                        flexShrink: 0,
                        background: colors.bgCardAlt,
                        border: `1px solid ${colors.border}`,
                        borderRadius: radii.sm,
                        color: colors.text,
                        fontSize: 12,
                        fontWeight: 700,
                        padding: '8px 12px',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 12, color: colors.textSoft, marginTop: 10, marginBottom: 0 }}>
                Already in your list — no need to add it again.
              </p>
            </div>
          )}

          {preview && (
            <div style={cardStyle}>
              <SectionHeader icon="➕" title={matches.length > 0 ? 'Not what you meant?' : "Can't find it"} />
              <p style={{ fontSize: 13, color: colors.textMid, margin: '0 0 12px' }}>
                We'll add <strong style={{ color: colors.text }}>{preview.exercise.name}</strong> to
                your exercise list as a <strong style={{ color: colors.text }}>{preview.exercise.category}</strong>{' '}
                movement, with estimated tiers and cues based on similar exercises.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                {preview.exercise.builds.map((b) => (
                  <span
                    key={b}
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: colors.textMid,
                      border: `1px solid ${colors.border}`,
                      borderRadius: radii.full,
                      padding: '4px 10px',
                    }}
                  >
                    {b}
                  </span>
                ))}
              </div>
              <button
                onClick={handleAdd}
                style={{
                  width: '100%',
                  background: colors.red,
                  border: 'none',
                  borderRadius: radii.md,
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: 800,
                  padding: '12px 0',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Add to Exercise List
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
