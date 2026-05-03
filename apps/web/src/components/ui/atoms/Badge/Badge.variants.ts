import { cva, type VariantProps } from 'class-variance-authority';

export const badgeVariants = cva(
  'inline-flex items-center rounded-full font-medium',
  {
    variants: {
      variant: {
        success: 'bg-brand-state-success-light text-brand-state-success-dark',
        warning: 'bg-brand-state-warning-light text-brand-state-warning-dark',
        error: 'bg-brand-state-error-light text-brand-state-error-dark',
        info: 'bg-brand-state-info-light text-brand-state-info-dark',
        neutral: 'bg-brand-neutral-100 text-brand-neutral-700',
        brand: 'bg-brand-primary-100 text-brand-primary-700',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'sm',
    },
  },
);

export type BadgeVariantsProps = VariantProps<typeof badgeVariants>;
