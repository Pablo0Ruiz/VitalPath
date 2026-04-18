import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-brand-primary-600 text-brand-text-inverse hover:bg-brand-primary-700 active:bg-brand-primary-700',
        secondary:
          'bg-brand-secondary-500 text-brand-text-inverse hover:bg-brand-secondary-600 active:bg-brand-secondary-600',
        ghost:
          'bg-transparent text-brand-text-primary hover:bg-brand-neutral-100 active:bg-brand-neutral-100',
        danger:
          'bg-brand-state-error text-white hover:bg-brand-state-error-dark active:bg-brand-state-error-dark',
        outline:
          'border border-brand-border bg-transparent text-brand-text-primary hover:bg-brand-neutral-50 active:bg-brand-neutral-100',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  },
);

export type ButtonVariantsProps = VariantProps<typeof buttonVariants>;
