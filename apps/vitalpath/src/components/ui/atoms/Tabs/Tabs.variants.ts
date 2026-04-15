import { cva, type VariantProps } from 'class-variance-authority';

export const tabsVariants = cva('', {
  variants: {
    variant: {
      date: 'bg-blue-500',
      active: 'bg-blue-500',
      pending: 'bg-slate-200',
    },
    defaultVariants: {
      variant: 'date',
    },
  },
});

export const textStyles = cva('', {
  variants: {
    variant: {
      date: 'text-white',
      active: 'text-white',
      pending: 'text-slate-400',
    },
    defaultVariants: {
      variant: 'date',
    },
  },
});

export type TabsVariantsProps = VariantProps<typeof tabsVariants>;
