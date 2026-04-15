import { cva, type VariantProps } from 'class-variance-authority';

export const avatarSizes = cva('items-center justify-center rounded-full', {
  variants: {
    size: {
      sm: 'w-8 h-8',
      md: 'w-11 h-11',
      lg: 'w-14 h-14',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const avatarText = cva('font-bold', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type AvatarSizes = VariantProps<typeof avatarSizes>;
