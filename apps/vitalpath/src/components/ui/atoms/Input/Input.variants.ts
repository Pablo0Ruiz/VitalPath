import { cva, type VariantProps } from 'class-variance-authority';

export const inputVariants = cva('', {
  variants: {
    variant: {
      primary: {
        container: 'bg-white border border-brand-slate-200 rounded-xl',
        input: 'text-brand-slate-900',
      },
      secondary: {
        container: 'bg-brand-teal-50 border border-brand-teal-200 rounded-xl',
        input: 'text-brand-slate-900',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
});

export type InputVariantsProps = VariantProps<typeof inputVariants>;
