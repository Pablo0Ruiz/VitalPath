import { cva, type VariantProps } from 'class-variance-authority';

export const cardVariants = cva(
  'bg-brand-surface border border-brand-border rounded-2xl shadow-(--brand-shadow-md) transition-all duration-200 ease-out',
  {
    variants: {
      padding: {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-5',
        lg: 'p-6',
      },
      interactive: {
        true: 'cursor-pointer motion-safe:hover:-translate-y-0.5 hover:shadow-[var(--brand-shadow-lg)] hover:border-brand-primary-200',
        false: '',
      },
      glass: {
        true: 'bg-white/60 dark:bg-white/5 backdrop-blur-md border-[var(--brand-glass-border)] shadow-[var(--brand-shadow-lg)]',
        false: '',
      },
      elevated: {
        true: 'bg-brand-surface-elevated shadow-[var(--brand-shadow-lg)]',
        false: '',
      },
    },
    defaultVariants: {
      padding: 'md',
      interactive: false,
      glass: false,
      elevated: false,
    },
  },
);

export type CardVariantsProps = VariantProps<typeof cardVariants>;
