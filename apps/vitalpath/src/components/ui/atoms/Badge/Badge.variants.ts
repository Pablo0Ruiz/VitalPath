import { cva, type VariantProps } from 'class-variance-authority';

export const badgeVariants = cva(
  'flex-row items-center px-2 py-0.5 rounded-full',
  {
    variants: {
      variant: {
        success: {
          container: 'bg-green-100',
          text: 'text-green-600 text-xs font-semibold',
        },
        error: {
          container: 'bg-red-100',
          text: 'text-red-500 text-xs font-semibold',
        },
        warning: {
          container: 'bg-amber-100',
          text: 'text-amber-500 text-xs font-semibold',
        },
        primary: {
          container: 'bg-brand-violet-100',
          text: 'text-brand-violet-600 text-xs font-semibold',
        },
        secondary: {
          container: 'bg-brand-teal-100',
          text: 'text-brand-teal-600 text-xs font-semibold',
        },
        neutral: {
          container: 'bg-brand-slate-100',
          text: 'text-brand-slate-500 text-xs font-semibold',
        },
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  },
);
export const badgeVariantsText = cva('', {
  variants: {
    variant: {
      success: 'text-green-600 text-xs font-semibold',
      error: 'text-red-500 text-xs font-semibold',
      warning: 'text-amber-500 text-xs font-semibold',
      primary: 'text-brand-violet-600 text-xs font-semibold',
      secondary: 'text-brand-teal-600 text-xs font-semibold',
      neutral: 'text-brand-slate-500 text-xs font-semibold',
    },
  },
  defaultVariants: {
    variant: 'neutral',
  },
});

export type BadgeVariants = VariantProps<typeof badgeVariants>;
