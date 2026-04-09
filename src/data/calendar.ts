// Kommersiell Kalender — data

export type CalendarRow =
  | 'theme'      // Brand / seasonal themes (top banner row)
  | 'holiday'    // Swedish holidays & seasons
  | 'campaign'   // Central campaigns
  | 'catman'     // Category management focus
  | 'other';     // Övrigt

export interface CalendarEvent {
  id: string;
  label: string;
  row: CalendarRow;
  /** Month index 0-11 */
  startMonth: number;
  /** Month index 0-11, inclusive */
  endMonth: number;
  color: string;   // background
  textColor: string;
  /** Optional sub-label or note shown in detail */
  note?: string;
}

// ── Colour palette ────────────────────────────────────────────────────────────
// Using simple hex values so no token import dependency

const C = {
  // Themes
  winter:   { color: '#dbeafe', textColor: '#1d4ed8' },
  spring:   { color: '#dcfce7', textColor: '#15803d' },
  summer:   { color: '#fef9c3', textColor: '#a16207' },
  autumn:   { color: '#ffedd5', textColor: '#c2410c' },
  xmas:     { color: '#fee2e2', textColor: '#dc2626' },
  // Holidays
  holiday:  { color: '#f3e8ff', textColor: '#7e22ce' },
  // Campaigns
  campaign: { color: '#e0f2fe', textColor: '#0369a1' },
  volume:   { color: '#d1fae5', textColor: '#065f46' },
  multi:    { color: '#fce7f3', textColor: '#9d174d' },
  // Catman
  catman:   { color: '#f1f5f9', textColor: '#475569' },
  // Other
  other:    { color: '#f5f5f5', textColor: '#737373' },
};

export const calendarEvents: CalendarEvent[] = [
  // ── Seasonal themes (row: theme) ─────────────────────────────────────────────
  { id: 't-winter', label: 'Vinter',   row: 'theme', startMonth: 0,  endMonth: 1,  ...C.winter },
  { id: 't-spring', label: 'Vår',      row: 'theme', startMonth: 2,  endMonth: 4,  ...C.spring },
  { id: 't-summer', label: 'Sommar',   row: 'theme', startMonth: 5,  endMonth: 7,  ...C.summer },
  { id: 't-autumn', label: 'Höst',     row: 'theme', startMonth: 8,  endMonth: 9,  ...C.autumn },
  { id: 't-xmas',   label: 'XMAS',     row: 'theme', startMonth: 10, endMonth: 11, ...C.xmas   },

  // ── Swedish holidays & seasons (row: holiday) ─────────────────────────────────
  { id: 'h-nyr',     label: 'Nyår',             row: 'holiday', startMonth: 0,  endMonth: 0,  ...C.holiday, note: '1 jan' },
  { id: 'h-hjd',     label: 'Alla hjärtans dag', row: 'holiday', startMonth: 1,  endMonth: 1,  ...C.holiday, note: '14 feb' },
  { id: 'h-pask',    label: 'Påsk',              row: 'holiday', startMonth: 3,  endMonth: 3,  ...C.holiday, note: 'April' },
  { id: 'h-valborg', label: 'Valborg',            row: 'holiday', startMonth: 3,  endMonth: 3,  ...C.holiday, note: '30 apr' },
  { id: 'h-morsd',   label: 'Mors dag',           row: 'holiday', startMonth: 4,  endMonth: 4,  ...C.holiday, note: 'Maj' },
  { id: 'h-mid',     label: 'Midsommar',          row: 'holiday', startMonth: 5,  endMonth: 5,  ...C.holiday, note: 'Juni' },
  { id: 'h-kraft',   label: 'Kräftskiva',         row: 'holiday', startMonth: 7,  endMonth: 7,  ...C.holiday, note: 'Augusti' },
  { id: 'h-halloween', label: 'Halloween',        row: 'holiday', startMonth: 9,  endMonth: 9,  ...C.holiday, note: '31 okt' },
  { id: 'h-advent',  label: 'Advent',             row: 'holiday', startMonth: 10, endMonth: 10, ...C.holiday, note: 'Nov' },
  { id: 'h-jul',     label: 'Jul',                row: 'holiday', startMonth: 11, endMonth: 11, ...C.holiday, note: 'Dec' },

  // ── Central campaigns (row: campaign) ─────────────────────────────────────────
  { id: 'c-samp',   label: 'Smakprovningskampanj', row: 'campaign', startMonth: 3, endMonth: 4, ...C.campaign, note: 'Apr–Maj 2026' },
  { id: 'c-vol',    label: 'Volymlyft Sommar',      row: 'campaign', startMonth: 4, endMonth: 6, ...C.volume,   note: 'Maj–Jul 2026' },
  { id: 'c-multi',  label: 'Multipris 3-för-2',     row: 'campaign', startMonth: 3, endMonth: 4, ...C.multi,    note: 'Apr–Maj 2026' },
  { id: 'c-back',   label: 'Back-to-school',        row: 'campaign', startMonth: 7, endMonth: 8, ...C.campaign, note: 'Aug–Sep' },
  { id: 'c-winter', label: 'Vinterkampanj',          row: 'campaign', startMonth: 10, endMonth: 11, ...C.volume, note: 'Nov–Dec' },

  // ── CatMan focus (row: catman) ────────────────────────────────────────────────
  { id: 'cat-juice', label: 'Juice-fokus Q1',     row: 'catman', startMonth: 0, endMonth: 2,  ...C.catman },
  { id: 'cat-frs',   label: 'Färskvaror Q2',      row: 'catman', startMonth: 3, endMonth: 5,  ...C.catman },
  { id: 'cat-summer',label: 'Sommar & Dryck Q3',  row: 'catman', startMonth: 6, endMonth: 8,  ...C.catman },
  { id: 'cat-jul',   label: 'Julsortiment Q4',    row: 'catman', startMonth: 9, endMonth: 11, ...C.catman },
];

export const ROW_LABELS: Record<CalendarRow, string> = {
  theme:    'Säsongsteman',
  holiday:  'Högtider & Säsonger',
  campaign: 'Centrala kampanjer',
  catman:   'CatMan-fokus',
  other:    'Övrigt',
};

export const ROW_ORDER: CalendarRow[] = ['theme', 'holiday', 'campaign', 'catman'];

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
