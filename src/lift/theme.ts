import type { Tier } from './types';

export const colors = {
  bg: '#0b0b0d',
  bgCard: '#16161a',
  bgCardAlt: '#1c1c21',
  border: '#2a2a30',
  text: '#f5f5f7',
  textMid: '#a5a5ad',
  textSoft: '#6f6f78',
  red: '#e0263f',
  redSoft: 'rgba(224, 38, 63, 0.15)',
  green: '#22c55e',
  greenSoft: 'rgba(34, 197, 94, 0.15)',
} as const;

export const tierColors: Record<Tier, string> = {
  S: '#e0263f',
  A: '#f97316',
  B: '#eab308',
  C: '#84cc16',
  D: '#3b82f6',
  E: '#6f6f78',
};

export const maxWidth = 480;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
} as const;

export const cardStyle: React.CSSProperties = {
  background: colors.bgCard,
  border: `1px solid ${colors.border}`,
  borderRadius: radii.lg,
  padding: spacing.lg,
};
