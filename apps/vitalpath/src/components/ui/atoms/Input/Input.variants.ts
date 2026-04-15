import { cva, type VariantProps } from 'class-variance-authority';

export const inputVariantsContainer = cva('flex-row items-center px-4 py-1', {
  variants: {
    variant: {
      primary: 'bg-white border border-brand-slate-200 rounded-xl',
      secondary: 'bg-brand-teal-50 border border-brand-teal-200 rounded-xl',
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
});

export const inputVariantsText = cva('flex-1 py-3 text-base tracking-[0.3px]', {
  variants: {
    variant: {
      primary: 'text-brand-slate-900',
      secondary: 'text-brand-slate-900',
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
});

export type InputVariantsProps = VariantProps<typeof inputVariantsContainer>;
