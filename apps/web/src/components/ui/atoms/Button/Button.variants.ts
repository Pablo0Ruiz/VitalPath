import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 motion-safe:hover:-translate-y-px motion-safe:active:scale-[0.97]',
  {
    variants: {
      variant: {
        primary:
          'bg-brand-primary-600 text-brand-text-inverse shadow-[var(--brand-shadow-sm)] hover:bg-brand-primary-700 hover:shadow-[var(--brand-shadow-md)] active:bg-brand-primary-700',
        secondary:
          'bg-brand-secondary-500 text-brand-text-inverse shadow-[var(--brand-shadow-sm)] hover:bg-brand-secondary-600 hover:shadow-[var(--brand-shadow-md)] active:bg-brand-secondary-600',
        ghost:
          'bg-transparent text-brand-text-primary hover:bg-brand-neutral-100 active:bg-brand-neutral-200',
        outline:
          'border border-brand-border bg-transparent text-brand-text-primary hover:bg-brand-surface hover:border-brand-primary-300 active:bg-brand-neutral-100',
        destructive:
          'bg-brand-state-error text-white shadow-[var(--brand-shadow-sm)] hover:bg-brand-state-error-dark hover:shadow-[var(--brand-shadow-md)] active:bg-brand-state-error-dark',
        ai: 'bg-brand-accent-ai text-white shadow-[var(--brand-shadow-sm)] hover:opacity-90 hover:shadow-[var(--brand-shadow-md)] active:opacity-100',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
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
