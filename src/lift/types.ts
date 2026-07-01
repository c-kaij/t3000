export type Goal = 'strength' | 'volume' | 'endurance' | 'total';

export type Tier = 'S' | 'A' | 'B' | 'C' | 'D' | 'E';

export interface RatingBreakdown {
  strengthCarryover: number;
  muscleBuilding: number;
  technicalDifficulty: number;
  recoveryCost: number;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  tagline: string;
  builds: string[];
  steps: string[];
  bestFor: string[];
  avoidIf: string[];
  mistakes: string[];
  ratings: RatingBreakdown;
  tiers: Record<Goal, Tier>;
  aliases?: string[];
  custom?: boolean;
}

export interface Point {
  x: number;
  y: number;
}

export interface Pose {
  head: Point;
  shoulder: Point;
  elbow: Point;
  hand: Point;
  hip: Point;
  knee: Point;
  ankle: Point;
  toe: Point;
  // optional trailing/rear leg, used for split-stance movements
  knee2?: Point;
  ankle2?: Point;
  toe2?: Point;
}

export type BarType = 'none' | 'barbell' | 'dumbbell';

export type Rig =
  | 'floor'
  | 'bench'
  | 'inclineBench'
  | 'pullupBar'
  | 'dipBars'
  | 'cableLow'
  | 'cableHigh'
  | 'legPressMachine'
  | 'hipThrustBench'
  | 'legCurlBench'
  | 'rearFootBench';

export interface MovementViz {
  bar: BarType;
  rig: Rig;
  start: Pose;
  finish: Pose;
}

export const GOALS: { id: Goal; label: string; blurb: string }[] = [
  { id: 'strength', label: 'Strength', blurb: 'Max force output & 1RM carryover' },
  { id: 'volume', label: 'Volume', blurb: 'Hypertrophy via accumulated sets' },
  { id: 'endurance', label: 'Endurance', blurb: 'High reps, low fatigue cost' },
  { id: 'total', label: 'Total', blurb: 'Well-rounded overall value' },
];
