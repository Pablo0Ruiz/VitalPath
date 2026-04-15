import { cva, type VariantProps } from 'class-variance-authority';

export const checkboxVariants = cva(
  'w-6 h-6 rounded-md border-2 mr-3 items-center justify-center',
  {
    variants: {
      checked: {
        true: 'bg-brand-violet-600 border-brand-violet-600',
        false: 'border-brand-slate-200 bg-white',
      },
    },
    defaultVariants: {
      checked: false,
    },
  },
);

export type CheckboxVariants = VariantProps<typeof checkboxVariants>;
