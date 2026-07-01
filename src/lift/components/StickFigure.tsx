import type { BarType, Point, Pose, Rig } from '../types';
import { colors } from '../theme';

const LIMB = colors.text;
const RIG_COLOR = colors.textSoft;

function Limbs({ pose, dim = false }: { pose: Pose; dim?: boolean }) {
  const stroke = dim ? RIG_COLOR : LIMB;
  const strokeWidth = dim ? 3 : 4;
  const segs: [Point, Point][] = [
    [{ x: pose.head.x, y: pose.head.y + 6 }, pose.shoulder],
    [pose.shoulder, pose.hip],
    [pose.hip, pose.knee],
    [pose.knee, pose.ankle],
    [pose.ankle, pose.toe],
    [pose.shoulder, pose.elbow],
    [pose.elbow, pose.hand],
  ];
  if (pose.knee2 && pose.ankle2 && pose.toe2) {
    segs.push([pose.hip, pose.knee2], [pose.knee2, pose.ankle2], [pose.ankle2, pose.toe2]);
  }
  return (
    <>
      {segs.map(([a, b], i) => (
        <line
          key={i}
          x1={a.x}
          y1={a.y}
          x2={b.x}
          y2={b.y}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      ))}
      <circle cx={pose.head.x} cy={pose.head.y} r={6} fill={stroke} />
    </>
  );
}

function BarOverlay({ bar, pose }: { bar: BarType; pose: Pose }) {
  if (bar === 'barbell') {
    const { x, y } = pose.hand;
    return (
      <g>
        <line x1={x - 16} y1={y} x2={x + 16} y2={y} stroke={colors.red} strokeWidth={3} />
        <circle cx={x - 16} cy={y} r={4} fill={colors.red} />
        <circle cx={x + 16} cy={y} r={4} fill={colors.red} />
      </g>
    );
  }
  if (bar === 'dumbbell') {
    const { x, y } = pose.hand;
    return <circle cx={x} cy={y} r={4} fill={colors.red} />;
  }
  return null;
}

function RigOverlay({ rig, pose }: { rig: Rig; pose: Pose }) {
  const stroke = RIG_COLOR;
  switch (rig) {
    case 'floor':
      return <line x1={4} y1={118} x2={96} y2={118} stroke={stroke} strokeWidth={2} />;
    case 'bench':
      return (
        <>
          <rect x={12} y={pose.hip.y + 6} width={72} height={7} rx={2} fill="none" stroke={stroke} strokeWidth={2} />
          <line x1={4} y1={118} x2={96} y2={118} stroke={stroke} strokeWidth={2} />
        </>
      );
    case 'inclineBench':
      return (
        <>
          <polygon
            points="8,98 58,54 66,60 16,104"
            fill="none"
            stroke={stroke}
            strokeWidth={2}
          />
          <line x1={4} y1={118} x2={96} y2={118} stroke={stroke} strokeWidth={2} />
        </>
      );
    case 'pullupBar':
      return (
        <>
          <line x1={pose.hand.x - 30} y1={pose.hand.y - 2} x2={pose.hand.x + 30} y2={pose.hand.y - 2} stroke={stroke} strokeWidth={3} />
          <line x1={pose.hand.x - 30} y1={pose.hand.y - 2} x2={pose.hand.x - 30} y2={pose.hand.y - 14} stroke={stroke} strokeWidth={2} />
          <line x1={pose.hand.x + 30} y1={pose.hand.y - 2} x2={pose.hand.x + 30} y2={pose.hand.y - 14} stroke={stroke} strokeWidth={2} />
        </>
      );
    case 'dipBars':
      return (
        <>
          <line x1={pose.hand.x - 12} y1={pose.hand.y} x2={pose.hand.x + 12} y2={pose.hand.y} stroke={stroke} strokeWidth={3} />
          <line x1={pose.hand.x + 10} y1={pose.hand.y} x2={pose.hand.x + 10} y2={118} stroke={stroke} strokeWidth={2} />
        </>
      );
    case 'cableLow':
      return (
        <>
          <line x1={95} y1={116} x2={95} y2={70} stroke={stroke} strokeWidth={2} />
          <line x1={95} y1={70} x2={pose.hand.x} y2={pose.hand.y} stroke={stroke} strokeWidth={2} strokeDasharray="3,3" />
          <rect x={91} y={112} width={8} height={8} fill="none" stroke={stroke} strokeWidth={2} />
        </>
      );
    case 'cableHigh':
      return (
        <>
          <line x1={pose.head.x} y1={4} x2={pose.head.x} y2={12} stroke={stroke} strokeWidth={2} />
          <circle cx={pose.head.x} cy={4} r={3} fill="none" stroke={stroke} strokeWidth={2} />
          <line x1={pose.head.x} y1={8} x2={pose.hand.x} y2={pose.hand.y} stroke={stroke} strokeWidth={2} strokeDasharray="3,3" />
          <line x1={4} y1={118} x2={96} y2={118} stroke={stroke} strokeWidth={2} />
        </>
      );
    case 'legPressMachine':
      return (
        <>
          <line x1={pose.toe.x - 4} y1={pose.toe.y - 20} x2={pose.toe.x + 6} y2={pose.toe.y + 8} stroke={stroke} strokeWidth={4} />
          <line x1={4} y1={100} x2={40} y2={100} stroke={stroke} strokeWidth={2} />
        </>
      );
    case 'hipThrustBench':
      return (
        <rect
          x={pose.shoulder.x - 10}
          y={pose.shoulder.y + 4}
          width={22}
          height={10}
          rx={2}
          fill="none"
          stroke={stroke}
          strokeWidth={2}
        />
      );
    case 'legCurlBench':
      return (
        <rect
          x={14}
          y={pose.hip.y + 4}
          width={70}
          height={7}
          rx={2}
          fill="none"
          stroke={stroke}
          strokeWidth={2}
        />
      );
    case 'rearFootBench':
      return pose.ankle2 ? (
        <rect
          x={pose.ankle2.x - 8}
          y={pose.ankle2.y - 4}
          width={18}
          height={8}
          rx={2}
          fill="none"
          stroke={stroke}
          strokeWidth={2}
        />
      ) : null;
    default:
      return null;
  }
}

export default function StickFigure({
  pose,
  bar,
  rig,
  label,
}: {
  pose: Pose;
  bar: BarType;
  rig: Rig;
  label?: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg viewBox="0 0 100 130" width="100%" height="150" style={{ maxWidth: 150 }}>
        <RigOverlay rig={rig} pose={pose} />
        <Limbs pose={pose} />
        <BarOverlay bar={bar} pose={pose} />
      </svg>
      {label && (
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 0.4,
            textTransform: 'uppercase',
            color: colors.textSoft,
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
