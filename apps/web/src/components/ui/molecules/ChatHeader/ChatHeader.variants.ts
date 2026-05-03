import { cva, type VariantProps } from 'class-variance-authority';

export const chatHeaderVariants = cva(
  'flex items-center gap-3 px-5 py-4 border-b border-brand-border/50 bg-brand-surface/50 shrink-0',
);

export const chatHeaderIconContainerVariants = cva('relative');

export const chatHeaderIconBoxVariants = cva(
  'flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-primary-600 shadow-sm shadow-brand-primary-200',
);

export const chatHeaderStatusIndicatorVariants = cva(
  'absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-brand-background bg-brand-state-success',
);
