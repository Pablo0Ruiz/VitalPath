import { cva, type VariantProps } from 'class-variance-authority';

export const buttonTitle = cva('font-semibold', {
  variants: {
    variant: {
      primary: 'text-white',
      secondary: 'text-white',
      outline: 'text-brand-violet-600',
      ghost: 'text-brand-violet-600',
      danger: 'text-red-600',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

export const buttonVariants = cva(
  'flex-row items-center justify-center rounded-xl',
  {
    variants: {
      variant: {
        primary: 'bg-brand-violet-600',
        secondary: 'bg-brand-teal-500',
        outline: 'border border-brand-violet-600 bg-transparent',
        ghost: 'bg-transparent',
        danger: 'bg-red-100',
      },
      size: {
        sm: 'px-3 py-2',
        md: 'px-4 py-4',
        lg: 'px-6 py-5',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
