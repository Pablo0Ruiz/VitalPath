import { cva, type VariantProps } from 'class-variance-authority';

export const buttonTitle = cva('text-base font-semibold', {
  variants: {
    variant: {
      primary: 'text-white',
      secondary: 'text-white',
      outline: 'text-brand-violet-600',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

export const buttonVariants = cva(
  'flex-row items-center justify-center rounded-xl px-4 py-4',
  {
    variants: {
      variant: {
        primary: 'bg-brand-violet-600',
        secondary: 'bg-brand-teal-500',
        outline: 'border border-brand-violet-600 bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
