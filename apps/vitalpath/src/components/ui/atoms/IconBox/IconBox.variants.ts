import { cva, type VariantProps } from 'class-variance-authority';

export const iconBoxVariants = cva('items-center justify-center rounded-xl', {
  variants: {
    size: {
      sm: 'w-7 h-7',
      md: 'w-8 h-8',
      lg: 'w-10 h-10',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type IconBoxVariants = VariantProps<typeof iconBoxVariants>;
