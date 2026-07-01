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
}

export const GOALS: { id: Goal; label: string; blurb: string }[] = [
  { id: 'strength', label: 'Strength', blurb: 'Max force output & 1RM carryover' },
  { id: 'volume', label: 'Volume', blurb: 'Hypertrophy via accumulated sets' },
  { id: 'endurance', label: 'Endurance', blurb: 'High reps, low fatigue cost' },
  { id: 'total', label: 'Total', blurb: 'Well-rounded overall value' },
];
