import { cva, type VariantProps } from 'class-variance-authority';

export const iconBoxVariants = cva(
  'inline-flex items-center justify-center rounded-lg flex-shrink-0',
  {
    variants: {
      tone: {
        brand: 'bg-brand-primary-100 text-brand-primary-600',
        success: 'bg-brand-state-success-light text-brand-state-success-dark',
        warning: 'bg-brand-state-warning-light text-brand-state-warning-dark',
        error: 'bg-brand-state-error-light text-brand-state-error-dark',
        neutral: 'bg-brand-neutral-100 text-brand-neutral-600',
      },
      size: {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
      },
    },
    defaultVariants: {
      tone: 'brand',
      size: 'md',
    },
  },
);

export type IconBoxVariantsProps = VariantProps<typeof iconBoxVariants>;
