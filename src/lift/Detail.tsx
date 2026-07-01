import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EXERCISES } from './data/exercises';
import { MOVEMENTS } from './data/movements';
import { GOALS, type Goal } from './types';
import { colors, cardStyle, radii, spacing } from './theme';
import TierBadge from './components/TierBadge';
import RatingBars from './components/RatingBars';
import SectionHeader from './components/SectionHeader';
import StickFigure from './components/StickFigure';

export default function Detail({ goal }: { goal: Goal }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const exercise = EXERCISES.find((e) => e.id === id);

  useEffect(() => {
    if (!exercise) navigate('/', { replace: true });
  }, [exercise, navigate]);

  if (!exercise) return null;

  const movement = MOVEMENTS[exercise.id];

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
        <div
          style={{
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 0.6,
            textTransform: 'uppercase',
            color: colors.red,
            marginBottom: 6,
          }}
        >
          {exercise.category}
        </div>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, letterSpacing: -0.5, color: colors.text }}>
          {exercise.name}
        </h1>
        <p style={{ margin: '6px 0 0', fontSize: 14, color: colors.textMid, lineHeight: 1.4 }}>
          {exercise.tagline}
        </p>
      </div>

      {movement && (
        <div style={cardStyle}>
          <SectionHeader icon="🖊️" title="Movement" />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <StickFigure pose={movement.start} bar={movement.bar} rig={movement.rig} label="Start" />
            <span style={{ color: colors.textSoft, fontSize: 22, flexShrink: 0 }}>→</span>
            <StickFigure pose={movement.finish} bar={movement.bar} rig={movement.rig} label="Finish" />
          </div>
        </div>
      )}

      <div style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        {GOALS.map((g) => (
          <div key={g.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <TierBadge tier={exercise.tiers[g.id]} size="lg" dim={g.id !== goal} />
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 0.3,
                textTransform: 'uppercase',
                color: g.id === goal ? colors.text : colors.textSoft,
              }}
            >
              {g.label}
            </span>
          </div>
        ))}
      </div>

      <div style={cardStyle}>
        <SectionHeader icon="💪" title="What It Builds" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {exercise.builds.map((item) => (
            <div key={item} style={{ display: 'flex', gap: 8, fontSize: 14, color: colors.text }}>
              <span style={{ color: colors.green }}>✓</span>
              {item}
            </div>
          ))}
        </div>
      </div>

      <div style={cardStyle}>
        <SectionHeader icon="📋" title="How To Execute" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {exercise.steps.map((step, i) => (
            <div key={step} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: radii.full,
                  background: colors.red,
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <span style={{ fontSize: 14, color: colors.text, paddingTop: 1 }}>{step}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={cardStyle}>
        <SectionHeader icon="🎯" title="When To Use It" />
        <div style={{ fontSize: 11, fontWeight: 700, color: colors.textSoft, marginBottom: 6 }}>
          BEST FOR:
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
          {exercise.bestFor.map((item) => (
            <div key={item} style={{ display: 'flex', gap: 8, fontSize: 14, color: colors.text }}>
              <span style={{ color: colors.green }}>✓</span>
              {item}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, color: colors.textSoft, marginBottom: 6 }}>
          AVOID IF:
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {exercise.avoidIf.map((item) => (
            <div key={item} style={{ display: 'flex', gap: 8, fontSize: 14, color: colors.text }}>
              <span style={{ color: colors.red }}>✗</span>
              {item}
            </div>
          ))}
        </div>
      </div>

      <div style={cardStyle}>
        <SectionHeader icon="⚠️" title="Common Mistakes" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {exercise.mistakes.map((item) => (
            <div key={item} style={{ display: 'flex', gap: 8, fontSize: 14, color: colors.text }}>
              <span style={{ color: colors.red }}>✗</span>
              {item}
            </div>
          ))}
        </div>
      </div>

      <div style={cardStyle}>
        <SectionHeader icon="⭐" title="Rating Breakdown" />
        <RatingBars ratings={exercise.ratings} />
      </div>
    </div>
  );
}
