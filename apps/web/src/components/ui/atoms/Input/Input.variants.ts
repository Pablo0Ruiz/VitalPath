import { cva, type VariantProps } from 'class-variance-authority';

export const inputVariants = cva(
  'flex w-full rounded-lg border bg-brand-background text-brand-text-primary text-sm placeholder:text-brand-neutral-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-600 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      error: {
        true: 'border-brand-state-error focus-visible:ring-brand-state-error',
        false: 'border-brand-border',
      },
      hasLeftIcon: {
        true: 'pl-10',
        false: 'pl-3',
      },
      hasRightIcon: {
        true: 'pr-10',
        false: 'pr-3',
      },
    },
    defaultVariants: {
      error: false,
      hasLeftIcon: false,
      hasRightIcon: false,
    },
  },
);

export type InputVariantsProps = VariantProps<typeof inputVariants>;
