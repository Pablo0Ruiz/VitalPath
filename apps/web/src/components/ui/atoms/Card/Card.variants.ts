import { cva, type VariantProps } from 'class-variance-authority';

export const cardVariants = cva(
  'bg-brand-background border border-brand-border rounded-xl shadow-[var(--brand-shadow-sm)]',
  {
    variants: {
      padding: {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-5',
        lg: 'p-6',
      },
    },
    defaultVariants: {
      padding: 'md',
    },
  },
);

export type CardVariantsProps = VariantProps<typeof cardVariants>;
