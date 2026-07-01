import type { Exercise, MovementViz } from './types';
import { MOVEMENTS } from './data/movements';

interface Archetype {
  keywords: string[];
  category: string;
  builds: string[];
  ratings: Exercise['ratings'];
  tiers: Exercise['tiers'];
  steps: string[];
  bestFor: string[];
  avoidIf: string[];
  mistakes: string[];
  borrowMovementFrom: string | null;
}

const ARCHETYPES: Archetype[] = [
  {
    keywords: ['squat'],
    category: 'Squat',
    builds: ['Quads', 'Glutes', 'Core'],
    ratings: { strengthCarryover: 3, muscleBuilding: 4, technicalDifficulty: 3, recoveryCost: 3 },
    tiers: { strength: 'B', volume: 'B', endurance: 'C', total: 'B' },
    steps: [
      'Set your feet about shoulder-width apart',
      'Brace your core before descending',
      'Lower under control to a comfortable depth',
      'Drive back up through the whole foot',
    ],
    bestFor: ['General lower-body strength and size', 'Warming up the squat pattern'],
    avoidIf: ['Uncontrolled knee or hip pain'],
    mistakes: ['Letting the knees cave in', 'Losing the upright torso', 'Rushing the descent'],
    borrowMovementFrom: 'back-squat',
  },
  {
    keywords: ['deadlift', 'hinge', 'rdl'],
    category: 'Hinge',
    builds: ['Hamstrings', 'Glutes', 'Spinal Erectors'],
    ratings: { strengthCarryover: 4, muscleBuilding: 4, technicalDifficulty: 3, recoveryCost: 4 },
    tiers: { strength: 'A', volume: 'A', endurance: 'D', total: 'A' },
    steps: [
      'Set up with the weight close to your shins',
      'Push your hips back while keeping a flat back',
      'Keep the weight close to your legs on the way up',
      'Finish by driving your hips through, not your lower back',
    ],
    bestFor: ['Posterior chain strength and mass', 'Improving hip hinge mechanics'],
    avoidIf: ['Acute low-back irritation or injury'],
    mistakes: ['Rounding the lower back', 'Letting the weight drift away from the body'],
    borrowMovementFrom: 'romanian-deadlift',
  },
  {
    keywords: ['bench', 'chest press', 'push-up', 'pushup', 'press up'],
    category: 'Push',
    builds: ['Chest', 'Triceps', 'Front Delts'],
    ratings: { strengthCarryover: 4, muscleBuilding: 4, technicalDifficulty: 3, recoveryCost: 4 },
    tiers: { strength: 'A', volume: 'B', endurance: 'D', total: 'A' },
    steps: [
      'Set your shoulder blades and grip',
      'Lower the weight under control to your chest',
      'Keep your elbows at a moderate angle, not flared to 90°',
      'Press back up to lockout',
    ],
    bestFor: ['Upper-body pressing strength', 'Chest and triceps mass'],
    avoidIf: ['Unrehabbed shoulder impingement or instability'],
    mistakes: ['Flaring the elbows too wide', 'Bouncing the weight at the bottom'],
    borrowMovementFrom: 'bench-press',
  },
  {
    keywords: ['overhead', 'shoulder press', 'military press'],
    category: 'Push',
    builds: ['Shoulders', 'Triceps'],
    ratings: { strengthCarryover: 3, muscleBuilding: 3, technicalDifficulty: 4, recoveryCost: 3 },
    tiers: { strength: 'A', volume: 'C', endurance: 'D', total: 'B' },
    steps: [
      'Brace your core and glutes',
      'Press straight up, moving your head back then through',
      'Lock out overhead with your biceps by your ears',
      'Lower under control',
    ],
    bestFor: ['Raw shoulder strength', 'Core bracing under a vertical load'],
    avoidIf: ['Limited overhead shoulder mobility'],
    mistakes: ['Excessive lower-back arch', 'Pressing the bar forward instead of straight up'],
    borrowMovementFrom: 'overhead-press',
  },
  {
    keywords: ['dip'],
    category: 'Push Accessory',
    builds: ['Chest', 'Triceps'],
    ratings: { strengthCarryover: 3, muscleBuilding: 4, technicalDifficulty: 3, recoveryCost: 3 },
    tiers: { strength: 'B', volume: 'A', endurance: 'A', total: 'B' },
    steps: [
      'Support yourself with arms locked out',
      'Lower under control until shoulders are near elbow height',
      'Keep elbows tracking back, not flared wide',
      'Press back up to lockout',
    ],
    bestFor: ['Bodyweight pressing strength and mass'],
    avoidIf: ['Shoulder pain at end-range depth'],
    mistakes: ['Descending too deep for shoulder tolerance', 'Flaring elbows out wide'],
    borrowMovementFrom: 'dip',
  },
  {
    keywords: ['pull-up', 'pullup', 'chin-up', 'chinup', 'pulldown', 'lat pull'],
    category: 'Pull',
    builds: ['Lats', 'Biceps', 'Upper Back'],
    ratings: { strengthCarryover: 3, muscleBuilding: 4, technicalDifficulty: 3, recoveryCost: 3 },
    tiers: { strength: 'A', volume: 'A', endurance: 'B', total: 'A' },
    steps: [
      'Depress your shoulder blades before pulling',
      'Pull your chest toward the bar or handle',
      'Drive your elbows down and back',
      'Return under control to a full stretch',
    ],
    bestFor: ['Relative back strength', 'Lat width and thickness'],
    avoidIf: ['Shoulder impingement flared by a full stretch'],
    mistakes: ['Using momentum instead of a strict pull', 'Not reaching a full stretch'],
    borrowMovementFrom: 'pull-up',
  },
  {
    keywords: ['row'],
    category: 'Pull',
    builds: ['Lats', 'Rhomboids', 'Rear Delts'],
    ratings: { strengthCarryover: 3, muscleBuilding: 5, technicalDifficulty: 3, recoveryCost: 3 },
    tiers: { strength: 'A', volume: 'S', endurance: 'C', total: 'A' },
    steps: [
      'Set up with a stable torso position',
      'Pull toward your lower ribs, elbows leading',
      'Squeeze your shoulder blades together at the top',
      'Return under control without losing position',
    ],
    bestFor: ['Back strength and thickness', 'Balancing pressing volume'],
    avoidIf: ['Lower back that cannot hold the required position under load'],
    mistakes: ['Using momentum to heave the weight', 'Rounding the upper back'],
    borrowMovementFrom: 'barbell-row',
  },
  {
    keywords: ['curl'],
    category: 'Arm Accessory',
    builds: ['Biceps', 'Forearms'],
    ratings: { strengthCarryover: 1, muscleBuilding: 4, technicalDifficulty: 1, recoveryCost: 1 },
    tiers: { strength: 'E', volume: 'B', endurance: 'B', total: 'D' },
    steps: [
      'Keep your elbows pinned to your sides',
      'Curl up without swinging your torso',
      'Squeeze hard at the top',
      'Lower under control to a full stretch',
    ],
    bestFor: ['Direct arm hypertrophy', 'High-rep pump finishers'],
    avoidIf: ['N/A — very low-risk when loaded appropriately'],
    mistakes: ['Swinging the torso to heave the weight up', 'Cutting the range of motion short'],
    borrowMovementFrom: 'barbell-curl',
  },
  {
    keywords: ['carry', 'farmer'],
    category: 'Total / Conditioning',
    builds: ['Grip', 'Core', 'Traps'],
    ratings: { strengthCarryover: 3, muscleBuilding: 3, technicalDifficulty: 2, recoveryCost: 3 },
    tiers: { strength: 'B', volume: 'C', endurance: 'S', total: 'A' },
    steps: [
      'Pick up the load with a braced core',
      'Stand tall, shoulders back',
      'Walk with short, controlled steps',
      'Set the load down under control',
    ],
    bestFor: ['Grip strength and endurance', 'Total-body bracing under load'],
    avoidIf: ['N/A — very low-risk when loaded appropriately'],
    mistakes: ['Letting the shoulders round forward', 'Rushing the steps and losing the brace'],
    borrowMovementFrom: 'farmers-carry',
  },
  {
    keywords: ['plank', 'core', 'ab ', 'abs', 'crunch'],
    category: 'Core',
    builds: ['Core', 'Obliques'],
    ratings: { strengthCarryover: 2, muscleBuilding: 2, technicalDifficulty: 1, recoveryCost: 1 },
    tiers: { strength: 'C', volume: 'D', endurance: 'S', total: 'C' },
    steps: [
      'Brace your core like bracing for a punch',
      'Keep a neutral spine throughout',
      'Breathe steadily without losing the brace',
    ],
    bestFor: ['Core bracing carryover to squats and deadlifts', 'Low-fatigue-cost core training'],
    avoidIf: ['N/A — very low-risk for almost everyone'],
    mistakes: ['Losing the neutral spine position', 'Holding the breath instead of bracing and breathing'],
    borrowMovementFrom: 'plank',
  },
  {
    keywords: ['lunge', 'split squat', 'step up', 'step-up'],
    category: 'Squat Accessory',
    builds: ['Quads', 'Glutes', 'Balance'],
    ratings: { strengthCarryover: 1, muscleBuilding: 4, technicalDifficulty: 2, recoveryCost: 2 },
    tiers: { strength: 'D', volume: 'B', endurance: 'B', total: 'B' },
    steps: [
      'Step into a stable stance',
      'Lower under control, keeping the front shin near-vertical',
      'Push back to the start position',
      'Keep your torso upright throughout',
    ],
    bestFor: ['Unilateral leg strength and size', 'Fixing left-right imbalances'],
    avoidIf: ['Balance issues that make loaded stepping unsafe'],
    mistakes: ['Front knee traveling too far past the toes', 'Leaning the torso too far forward'],
    borrowMovementFrom: 'walking-lunge',
  },
  {
    keywords: ['leg curl', 'hamstring curl'],
    category: 'Hamstring Accessory',
    builds: ['Hamstrings'],
    ratings: { strengthCarryover: 1, muscleBuilding: 4, technicalDifficulty: 1, recoveryCost: 1 },
    tiers: { strength: 'E', volume: 'A', endurance: 'A', total: 'D' },
    steps: [
      'Curl toward your glutes',
      'Squeeze hard at full contraction',
      'Control the return to a full stretch',
    ],
    bestFor: ['Isolated hamstring hypertrophy', 'Balancing quad-dominant training'],
    avoidIf: ['N/A — very low-risk when loaded appropriately'],
    mistakes: ['Using momentum instead of a controlled tempo', 'Cutting the stretch short'],
    borrowMovementFrom: 'leg-curl',
  },
  {
    keywords: ['hip thrust', 'glute bridge', 'glute'],
    category: 'Posterior Chain Accessory',
    builds: ['Glutes', 'Hamstrings'],
    ratings: { strengthCarryover: 2, muscleBuilding: 5, technicalDifficulty: 2, recoveryCost: 2 },
    tiers: { strength: 'D', volume: 'S', endurance: 'A', total: 'B' },
    steps: [
      'Set up with your upper back supported',
      'Drive your hips up hard through your heels',
      'Squeeze your glutes fully at the top',
      'Lower under control',
    ],
    bestFor: ['Direct glute hypertrophy', 'Training around a cranky lower back'],
    avoidIf: ['Discomfort from the load resting on the hip crease'],
    mistakes: ['Hyperextending the lower back instead of the hips', 'Not reaching full hip extension'],
    borrowMovementFrom: 'hip-thrust',
  },
  {
    keywords: ['face pull', 'rear delt'],
    category: 'Shoulder Health Accessory',
    builds: ['Rear Delts', 'Rotator Cuff'],
    ratings: { strengthCarryover: 1, muscleBuilding: 3, technicalDifficulty: 2, recoveryCost: 1 },
    tiers: { strength: 'E', volume: 'B', endurance: 'A', total: 'C' },
    steps: [
      'Pull toward your face, leading with your elbows high',
      'Externally rotate at the end of the pull',
      'Control the return to a full stretch',
    ],
    bestFor: ['Shoulder health and injury prevention', 'Balancing heavy pressing volume'],
    avoidIf: ['N/A — very low-risk when loaded appropriately'],
    mistakes: ['Pulling with the arms instead of leading with the elbows'],
    borrowMovementFrom: 'face-pull',
  },
];

const FALLBACK: Archetype = {
  keywords: [],
  category: 'Custom',
  builds: ['Full Body'],
  ratings: { strengthCarryover: 3, muscleBuilding: 3, technicalDifficulty: 3, recoveryCost: 3 },
  tiers: { strength: 'C', volume: 'C', endurance: 'C', total: 'C' },
  steps: [
    'Set up with good posture and a braced core',
    'Move through a controlled range of motion',
    'Avoid using momentum to complete the rep',
  ],
  bestFor: ['General training variety'],
  avoidIf: ['Any pain that changes your movement pattern'],
  mistakes: ['Rushing the tempo', 'Losing your bracing position'],
  borrowMovementFrom: null,
};

function titleCase(s: string): string {
  return s
    .trim()
    .split(/\s+/)
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function inferExercise(
  query: string,
  existingIds: Set<string>,
): { exercise: Exercise; movement: MovementViz | null } {
  const q = query.toLowerCase();
  const archetype = ARCHETYPES.find((a) => a.keywords.some((k) => q.includes(k))) ?? FALLBACK;

  const baseId = slugify(query) || 'custom-exercise';
  let id = baseId;
  let n = 2;
  while (existingIds.has(id)) {
    id = `${baseId}-${n}`;
    n += 1;
  }

  const name = titleCase(query) || 'Custom Exercise';

  const exercise: Exercise = {
    id,
    name,
    category: archetype.category,
    tagline: 'Added by you — tiers and cues below are estimated, not hand-verified.',
    builds: archetype.builds,
    steps: archetype.steps,
    bestFor: archetype.bestFor,
    avoidIf: archetype.avoidIf,
    mistakes: archetype.mistakes,
    ratings: archetype.ratings,
    tiers: archetype.tiers,
    custom: true,
  };

  const movement = archetype.borrowMovementFrom ? MOVEMENTS[archetype.borrowMovementFrom] ?? null : null;

  return { exercise, movement };
}
