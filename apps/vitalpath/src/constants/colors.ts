export const colors = {
  brand: {
    /* ── Violet Scales (Uso: bg-brand-violet-600) ───────────────── */
    violet: {
      50: 'var(--brand-primary-50)',
      100: 'var(--brand-primary-100)',
      200: 'var(--brand-primary-200)',
      300: 'var(--brand-primary-300)',
      400: 'var(--brand-primary-400)',
      500: 'var(--brand-primary-500)',
      600: 'var(--brand-primary-600)',
      700: 'var(--brand-primary-700)',
      800: 'var(--brand-primary-800)',
      900: 'var(--brand-primary-900)',
      950: 'var(--brand-primary-950)',
    },
    /* ── Teal Scales (Uso: bg-brand-teal-500) ──────────────────── */
    teal: {
      50: 'var(--brand-secondary-50)',
      100: 'var(--brand-secondary-100)',
      200: 'var(--brand-secondary-200)',
      300: 'var(--brand-secondary-300)',
      400: 'var(--brand-secondary-400)',
      500: 'var(--brand-secondary-500)',
      600: 'var(--brand-secondary-600)',
      700: 'var(--brand-secondary-700)',
      800: 'var(--brand-secondary-800)',
      900: 'var(--brand-secondary-900)',
      950: 'var(--brand-secondary-950)',
    },
    /* ── Neutral Scales (Uso: bg-brand-slate-500) ────────────────── */
    slate: {
      50: 'var(--brand-neutral-50)',
      100: 'var(--brand-neutral-100)',
      200: 'var(--brand-neutral-200)',
      300: 'var(--brand-neutral-300)',
      400: 'var(--brand-neutral-400)',
      500: 'var(--brand-neutral-500)',
      600: 'var(--brand-neutral-600)',
      700: 'var(--brand-neutral-700)',
      800: 'var(--brand-neutral-800)',
      900: 'var(--brand-neutral-900)',
      950: 'var(--brand-neutral-950)',
    },
    /* ── Semantic Tokens (Uso: bg-brand-background, text-brand-main) ── */
    background: 'var(--brand-background)',
    surface: 'var(--brand-surface)',
    main: 'var(--brand-text-primary)',
    subtle: 'var(--brand-text-secondary)',
    inverse: 'var(--brand-text-inverse)',
    border: 'var(--brand-border)',
  },

  /* ── System Status (Uso: bg-success, text-error) ─────────────── */
  success: 'var(--brand-state-success)',
  warning: 'var(--brand-state-warning)',
  error: 'var(--brand-state-error)',
  info: 'var(--brand-state-info)',

  /* ── Compatibility Aliases ──────────────────────────────────── */
  'bg-base': 'var(--brand-background)',
  'text-primary': 'var(--brand-text-primary)',
} as const;
