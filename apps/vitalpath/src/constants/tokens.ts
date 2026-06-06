const light = {
  background: '#F5F7FC',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceDark: '#1e2f8a',

  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textInverse: '#FFFFFF',

  border: '#E4E7EF',

  online: '#22C55E',

  primary50: '#eef1fe',
  primary100: '#dde3fd',
  primary200: '#bbc7fb',
  primary500: '#6480f8',
  primary600: '#4f6ef7',
  primary700: '#3a57e0',
  primary900: '#1e2f8a',

  secondary50: '#F0FDFA',
  secondary100: '#CCFBF1',
  secondary200: '#99F6E4',
  secondary500: '#14B8A6',
  secondary600: '#0D9488',
  secondary700: '#0F766E',
  secondary900: '#134E4A',

  accentAi: '#9B5DE5',

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

  error: '#EF4444',
  errorLight: '#FEE2E2',
  errorDark: '#991B1B',
  success: '#10B981',
  successLight: '#D1FAE5',
  successDark: '#065F46',
  successText: '#065F46',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  warningDark: '#92400E',
  info: '#3B82F6',
  infoLight: '#DBEAFE',
  infoDark: '#1E40AF',
  white: '#FFFFFF',
  black: '#000000',

  glassBorder: 'rgba(79, 110, 247, 0.20)',

  fontSizeDisplay: 32,
  fontSizeTitle: 24,
  fontSizeBody: 15,
  fontSizeCaption: 13,
  fontSizeLabel: 11,

  radiusCard: 16,
  radiusHero: 20,
  radiusSheet: 24,

  minTouchTarget: 44,
} as const;

const dark = {
  background: '#13141F',
  surface: '#1C1E2E',
  surfaceElevated: '#252841',
  surfaceDark: '#0D0E18',

  textPrimary: '#EEF0F8',
  textSecondary: '#8B90A8',
  textInverse: '#13141F',

  border: '#2F3347',

  online: '#22C55E',

  primary50: '#eef1fe',
  primary100: '#dde3fd',
  primary200: '#bbc7fb',
  primary500: '#7b8ffa',
  primary600: '#7b8ffa',
  primary700: '#9aaafb',
  primary900: '#dde3fd',

  secondary50: '#F0FDFA',
  secondary100: '#CCFBF1',
  secondary200: '#99F6E4',
  secondary500: '#2DD4BF',
  secondary600: '#14B8A6',
  secondary700: '#0D9488',
  secondary900: '#134E4A',

  accentAi: '#B87AF8',

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

  error: '#F87171',
  errorLight: '#450a0a',
  errorDark: '#ef4444',
  success: '#34D399',
  successLight: '#064e3b',
  successDark: '#10b981',
  successText: '#34D399',
  warning: '#FBBF24',
  warningLight: '#451a03',
  warningDark: '#f59e0b',
  info: '#60A5FA',
  infoLight: '#1e3a8a',
  infoDark: '#3b82f6',
  white: '#FFFFFF',
  black: '#000000',

  glassBorder: 'rgba(123, 143, 250, 0.22)',

  fontSizeDisplay: 32,
  fontSizeTitle: 24,
  fontSizeBody: 15,
  fontSizeCaption: 13,
  fontSizeLabel: 11,

  radiusCard: 16,
  radiusHero: 20,
  radiusSheet: 24,

  minTouchTarget: 44,
} as const;

export const seniorTokens = {
  fontSizeDisplay: 44,
  fontSizeTitle: 32,
  fontSizeBody: 20,
  fontSizeCaption: 17,
  fontSizeLabel: 16,
  minTouchTarget: 56,
  textSecondary: '#4B5563',
  border: '#9CA3AF',
} as const;

export type SeniorTokenOverrides = typeof seniorTokens;

export const tokens = { light, dark } as const;

export type ThemeTokens = {
  [K in keyof typeof light]: (typeof light)[K] extends number ? number : string;
};
