import { cva, type VariantProps } from 'class-variance-authority';

export const statCardAccentVariants = cva(
  'absolute inset-x-0 top-0 h-[3px] bg-linear-to-r',
  {
    variants: {
      tone: {
        brand: 'from-brand-primary-500 to-brand-accent-ai',
        success: 'from-brand-state-success to-brand-secondary-500',
        warning: 'from-brand-state-warning to-amber-400',
        error: 'from-brand-state-error to-rose-400',
        neutral: 'from-brand-neutral-400 to-brand-neutral-300',
      },
    },
    defaultVariants: {
      tone: 'brand',
    },
  },
);

export const statCardIconVariants = cva(
  'w-10 h-10 rounded-xl flex items-center justify-center',
  {
    variants: {
      tone: {
        brand:
          'bg-brand-primary-50 text-brand-primary-600 dark:bg-brand-primary-600/15 dark:text-brand-primary-400',
        success:
          'bg-brand-state-success-light text-brand-state-success-dark dark:bg-brand-state-success-light/20 dark:text-brand-state-success',
        warning:
          'bg-brand-state-warning-light text-brand-state-warning-dark dark:bg-brand-state-warning-light/20 dark:text-brand-state-warning',
        error:
          'bg-brand-state-error-light text-brand-state-error-dark dark:bg-brand-state-error-light/20 dark:text-brand-state-error',
        neutral:
          'bg-brand-neutral-100 text-brand-neutral-600 dark:bg-brand-neutral-800 dark:text-brand-neutral-400',
      },
    },
    defaultVariants: {
      tone: 'brand',
    },
  },
);

export type StatCardAccentVariantsProps = VariantProps<
  typeof statCardAccentVariants
>;
export type StatCardIconVariantsProps = VariantProps<
  typeof statCardIconVariants
>;
