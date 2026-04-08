// Design tokens — single source of truth for colors, spacing, radii
export const colors = {
  // Backgrounds
  bg: '#ffffff',
  bgSoft: '#f9fafb',
  bgMuted: '#f3f4f6',

  // Borders & text
  border: '#e5e7eb',
  text: '#111827',
  mid: '#6b7280',
  soft: '#9ca3af',

  // Blue (primary)
  blue: '#2563eb',
  blueBg: '#eff6ff',
  blueBorder: '#bfdbfe',

  // Semantic colours
  green: '#16a34a',
  greenBg: '#f0fdf4',
  amber: '#b45309',
  amberBg: '#fffbeb',
  red: '#b91c1c',
  redBg: '#fef2f2',
  purple: '#6d28d9',
  purpleBg: '#f5f3ff',
  teal: '#0f766e',
  tealBg: '#f0fdfa',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radii = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 14,
  xxl: 16,
  full: 9999,
} as const;

export const fontSizes = {
  xxs: 10,
  xs: 11,
  sm: 12,
  md: 13,
  base: 14,
  lg: 15,
  xl: 16,
  xxl: 20,
  xxxl: 26,
} as const;

// Minimum touch target size (iOS HIG)
export const minTouchTarget = 44;

// App max width for iPad-feel centering
export const maxWidth = 768;

// Shorthand card style factory
export const card = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  background: colors.bg,
  borderRadius: radii.xl,
  border: `1px solid ${colors.border}`,
  padding: `${spacing.md}px ${spacing.lg}px`,
  ...extra,
});

// Shorthand button style factory
export const btn = (
  bg: string,
  color: string,
  extra: React.CSSProperties = {}
): React.CSSProperties => ({
  background: bg,
  color,
  border: 'none',
  borderRadius: radii.md,
  cursor: 'pointer',
  fontFamily: 'inherit',
  ...extra,
});
