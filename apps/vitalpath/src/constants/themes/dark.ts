export const darkTheme = {
  /* ── Brand Primary Scale ─────────────────────────────────────── */
  '--brand-primary-50': '#f5f3ff',
  '--brand-primary-100': '#ede9fe',
  '--brand-primary-200': '#ddd6fe',
  '--brand-primary-300': '#c4b5fd',
  '--brand-primary-400': '#a78bfa',
  '--brand-primary-500': '#8b5cf6',
  '--brand-primary-600': '#7c3aed', // Base (Violet)
  '--brand-primary-700': '#6d28d9',
  '--brand-primary-800': '#5b21b6',
  '--brand-primary-900': '#4c1d95',
  '--brand-primary-950': '#2e1065',

  /* ── Brand Secondary Scale ───────────────────────────────────── */
  '--brand-secondary-50': '#f0fdfa',
  '--brand-secondary-100': '#ccfbf1',
  '--brand-secondary-200': '#99f6e4',
  '--brand-secondary-300': '#5eead4',
  '--brand-secondary-400': '#2dd4bf',
  '--brand-secondary-500': '#14b8a6', // Base (Teal)
  '--brand-secondary-600': '#0d9488',
  '--brand-secondary-700': '#0f766e',
  '--brand-secondary-800': '#115e59',
  '--brand-secondary-900': '#134e4a',
  '--brand-secondary-950': '#042f2e',

  /* ── Neutral: Dark Tech Surface ───────────────────────────────── */
  '--brand-neutral-50': '#f8fafc',
  '--brand-neutral-100': '#f1f5f9',
  '--brand-neutral-200': '#e2e8f0',
  '--brand-neutral-300': '#cbd5e1',
  '--brand-neutral-400': '#94a3b8',
  '--brand-neutral-500': '#64748b',
  '--brand-neutral-600': '#475569',
  '--brand-neutral-700': '#334155',
  '--brand-neutral-800': '#1e293b',
  '--brand-neutral-900': '#0f172a',
  '--brand-neutral-950': '#020617', // Deep midnight base

  /* ── State ───────────────────────────────────────────────────── */
  '--brand-state-error': '#F87171',
  '--brand-state-error-light': '#450a0a',
  '--brand-state-error-dark': '#ef4444',

  '--brand-state-success': '#34D399',
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
    '0 10px 15px -3px rgba(124, 58, 237, 0.2), 0 4px 6px -2px rgba(124, 58, 237, 0.1)',

  /* ── Semantic Tokens ─────────────────────────────────────────── */
  '--brand-background': '#020617', // Absolute midnight for deep contrast
  '--brand-surface': 'var(--brand-neutral-900)',
  '--brand-text-primary': '#f9fafb',
  '--brand-text-secondary': 'var(--brand-neutral-400)',
  '--brand-text-inverse': '#020617',
  '--brand-border': 'var(--brand-neutral-800)',

  /* Compatibility Mapping */
  '--color-brand-primary': 'var(--brand-primary-400)', // Brighter for dark mode visibility
  '--color-brand-secondary': 'var(--brand-secondary-400)',
  '--color-brand-muted': 'var(--brand-neutral-900)',
  '--color-bg-base': 'var(--brand-background)',
  '--color-bg-surface': 'var(--brand-surface)',
  '--color-bg-subtle': '#111827',
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
