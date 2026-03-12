export const colors = {
  brand: {
    primary: 'var(--color-brand-primary)',
    secondary: 'var(--color-brand-secondary)',
    muted: 'var(--color-brand-muted)',
  },

  bg: {
    base: 'var(--color-bg-base)',
    surface: 'var(--color-bg-surface)',
    subtle: 'var(--color-bg-subtle)',
  },

  text: {
    primary: 'var(--color-text-primary)',
    secondary: 'var(--color-text-secondary)',
    disabled: 'var(--color-text-disabled)',
    inverse: 'var(--color-text-inverse)',
    link: 'var(--color-text-link)',
  },

  border: {
    default: 'var(--color-border-default)',
    strong: 'var(--color-border-strong)',
  },

  feedback: {
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    error: 'var(--color-error)',
    info: 'var(--color-info)',
  },

  icon: {
    default: 'var(--color-icon-default)',
    brand: 'var(--color-icon-brand)',
  },
} as const;
