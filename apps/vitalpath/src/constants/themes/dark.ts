export const darkTheme = {
  /* ── Brand Primary Scale ─────────────────────────────────────── */
  '--brand-primary-50': '#F5F4FF',
  '--brand-primary-100': '#E8E6FE',
  '--brand-primary-200': '#D0CCFC',
  '--brand-primary-300': '#AFA6FA',
  '--brand-primary-400': '#9D94FF',
  '--brand-primary-500': '#8B7FF8',
  '--brand-primary-600': '#7B6FFF',
  '--brand-primary-700': '#3B2FD9',
  '--brand-primary-800': '#2820B5',
  '--brand-primary-900': '#1A1580',
  '--brand-primary-950': '#0D0A4A',

  /* ── Brand Secondary Scale ───────────────────────────────────── */
  '--brand-secondary-50': '#F0FDF9',
  '--brand-secondary-100': '#CCFBF0',
  '--brand-secondary-200': '#99F5E1',
  '--brand-secondary-300': '#4DE8C0',
  '--brand-secondary-400': '#4DE8C0',
  '--brand-secondary-500': '#1AD9A8',
  '--brand-secondary-600': '#00A87D',
  '--brand-secondary-700': '#008862',
  '--brand-secondary-800': '#006649',
  '--brand-secondary-900': '#004D37',
  '--brand-secondary-950': '#002E20',

  /* ── Neutral: Zinc Scale ──────────────────────────────────── */
  '--brand-neutral-50': '#FAFAFA',
  '--brand-neutral-100': '#F4F4F5',
  '--brand-neutral-200': '#E4E4E7',
  '--brand-neutral-300': '#D1D1D6',
  '--brand-neutral-400': '#A1A1AA',
  '--brand-neutral-500': '#71717A',
  '--brand-neutral-600': '#52525B',
  '--brand-neutral-700': '#3F3F46',
  '--brand-neutral-800': '#27272A',
  '--brand-neutral-900': '#18181B',
  '--brand-neutral-950': '#09090B',

  /* ── State ───────────────────────────────────────────────────── */
  '--brand-state-error': '#FF6B85',
  '--brand-state-error-light': '#450a0a',
  '--brand-state-error-dark': '#ef4444',

  '--brand-state-success': '#1AD9A8',
  '--brand-state-success-light': '#064e3b',
  '--brand-state-success-dark': '#10b981',

  '--brand-state-warning': '#FBBF24',
  '--brand-state-warning-light': '#451a03',
  '--brand-state-warning-dark': '#f59e0b',

  '--brand-state-info': '#60A5FA',
  '--brand-state-info-light': '#1e3a8a',
  '--brand-state-info-dark': '#3b82f6',

  /* ── Shadows (Glow effect for dark mode) ──────────────────────── */
  '--brand-shadow-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
  '--brand-shadow-md':
    '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.4)',
  '--brand-shadow-lg':
    '0 10px 15px -3px rgba(123, 111, 255, 0.2), 0 4px 6px -2px rgba(123, 111, 255, 0.1)',

  /* ── Semantic Tokens ─────────────────────────────────────────── */
  '--brand-background': '#0C0E1A',
  '--brand-surface': '#151826',
  '--brand-text-primary': '#F4F6FF',
  '--brand-text-secondary': 'var(--brand-neutral-400)',
  '--brand-text-inverse': '#0C0E1A',
  '--brand-border': 'var(--brand-neutral-800)',

  /* Compatibility Mapping */
  '--color-brand-primary': 'var(--brand-primary-400)',
  '--color-brand-secondary': 'var(--brand-secondary-400)',
  '--color-brand-muted': 'var(--brand-neutral-900)',
  '--color-bg-base': 'var(--brand-background)',
  '--color-bg-surface': 'var(--brand-surface)',
  '--color-bg-subtle': '#1A1D2E',
  '--color-text-primary': 'var(--brand-text-primary)',
  '--color-text-secondary': 'var(--brand-text-secondary)',
  '--color-text-inverse': 'var(--brand-text-inverse)',
  '--color-text-link': 'var(--brand-primary-400)',
  '--color-border-default': 'var(--brand-border)',
  '--color-success': 'var(--brand-state-success)',
  '--color-warning': 'var(--brand-state-warning)',
  '--color-error': 'var(--brand-state-error)',
  '--color-info': 'var(--brand-state-info)',
  '--color-icon-default': 'var(--brand-neutral-400)',
  '--color-icon-brand': 'var(--brand-primary-400)',
};
