import { cva, type VariantProps } from 'class-variance-authority';

export const textFieldVariants = cva('text-left', {
  variants: {
    variant: {
      title: 'text-[28px] font-bold text-slate-600 leading-[34px]',
      subtitle: 'text-sm font-normal text-slate-400',
      body: 'text-sm font-semibold text-slate-900',
      caption: 'text-xs font-medium text-slate-900 ',
      label: 'text-[11px] font-bold tracking-widest uppercase text-slate-900',
    },
  },
  defaultVariants: {
    variant: 'body',
  },
});

export type TextFieldVariants = VariantProps<typeof textFieldVariants>;
