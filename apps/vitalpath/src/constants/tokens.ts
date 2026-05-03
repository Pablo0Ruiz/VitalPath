const light = {
  // ── Surfaces ─────────────────────────────────────────────────
  background: '#F6F4F9',
  surface: '#FDFCFF',
  surfaceElevated: '#FFFFFF',
  surfaceDark: '#2C123E',

  // ── Text ─────────────────────────────────────────────────────
  textPrimary: '#1C1030',
  textSecondary: '#5C5670',
  textInverse: '#FFFFFF',

  // ── Border ───────────────────────────────────────────────────
  border: '#E5DEED',

  // ── Online presence ──────────────────────────────────────────
  online: '#22C55E',

  // ── Brand Primary: Royal Plum ────────────────────────────────
  primary50: '#F5F0FB',
  primary100: '#EBE1F7',
  primary200: '#D7C3EF',
  primary500: '#8B5DC8',
  primary600: '#4B2067',
  primary700: '#3A1852',
  primary900: '#1E0C2B',

  // ── Brand Secondary: Teal ────────────────────────────────────
  secondary50: '#F0FDFA',
  secondary100: '#CCFBF1',
  secondary200: '#99F6E4',
  secondary500: '#14B8A6',
  secondary600: '#0D9488',
  secondary700: '#0F766E',
  secondary900: '#134E4A',

  // ── Neutral: Zinc ────────────────────────────────────────────
  neutral50: '#FAFAFA',
  neutral100: '#F4F4F5',
  neutral200: '#E4E4E7',
  neutral300: '#D1D1D6',
  neutral400: '#A1A1AA',
  neutral500: '#71717A',
  neutral600: '#52525B',
  neutral700: '#3F3F46',
  neutral800: '#27272A',
  neutral900: '#18181B',
  neutral950: '#09090B',

  // ── State ────────────────────────────────────────────────────
  error: '#FF4D6A',
  errorLight: '#FFE4EA',
  errorDark: '#CC0033',
  success: '#00C896',
  successLight: '#CCFBF0',
  successDark: '#006649',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  warningDark: '#92400E',
  info: '#3B82F6',
  infoLight: '#DBEAFE',
  infoDark: '#1E40AF',
  white: '#FFFFFF',
  black: '#000000',
  fontSizeTitle: 28,
  fontSizeBody: 14,
  fontSizeCaption: 12,
  fontSizeLabel: 11,
  minTouchTarget: 44,
} as const;

const dark = {
  // ── Surfaces ─────────────────────────────────────────────────
  background: '#0C0A14',
  surface: '#1A1526',
  surfaceElevated: '#261E38',
  surfaceDark: '#0C0A14',

  // ── Text ─────────────────────────────────────────────────────
  textPrimary: '#F0ECF8',
  textSecondary: '#9B97A8',
  textInverse: '#1C1030',

  // ── Border ───────────────────────────────────────────────────
  border: '#3A2E50',

  // ── Online presence ──────────────────────────────────────────
  online: '#22C55E',

  // ── Brand Primary: Champagne Gold ────────────────────────────
  primary50: '#FEF9EC',
  primary100: '#FDF3D3',
  primary200: '#FBE7A7',
  primary500: '#E8BB45',
  primary600: '#D4A843',
  primary700: '#AA8435',
  primary900: '#57411A',

  // ── Brand Secondary: Cyan ────────────────────────────────────
  secondary50: '#ECFEFF',
  secondary100: '#CFFAFE',
  secondary200: '#A5F3FC',
  secondary500: '#06B6D4',
  secondary600: '#0891B2',
  secondary700: '#0E7490',
  secondary900: '#164E63',

  // ── Neutral: Zinc (same scale, dark context) ─────────────────
  neutral50: '#FAFAFA',
  neutral100: '#F4F4F5',
  neutral200: '#E4E4E7',
  neutral300: '#D1D1D6',
  neutral400: '#A1A1AA',
  neutral500: '#71717A',
  neutral600: '#52525B',
  neutral700: '#3F3F46',
  neutral800: '#27272A',
  neutral900: '#18181B',
  neutral950: '#09090B',

  // ── State ────────────────────────────────────────────────────
  error: '#FF6B85',
  errorLight: '#450a0a',
  errorDark: '#ef4444',
  success: '#1AD9A8',
  successLight: '#064e3b',
  successDark: '#10b981',
  warning: '#FBBF24',
  warningLight: '#451a03',
  warningDark: '#f59e0b',
  info: '#60A5FA',
  infoLight: '#1e3a8a',
  infoDark: '#3b82f6',
  white: '#FFFFFF',
  black: '#000000',
  fontSizeTitle: 28,
  fontSizeBody: 14,
  fontSizeCaption: 12,
  fontSizeLabel: 11,
  minTouchTarget: 44,
} as const;

export const seniorTokens = {
  fontSizeTitle: 40,
  fontSizeBody: 20,
  fontSizeCaption: 17,
  fontSizeLabel: 16,
  minTouchTarget: 56,
  textSecondary: '#3D3858',
  border: '#B8AFCC',
} as const;

export type SeniorTokenOverrides = typeof seniorTokens;

export const tokens = { light, dark } as const;

export type ThemeTokens = {
  [K in keyof typeof light]: (typeof light)[K] extends number ? number : string;
};
