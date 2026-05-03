import { cva, type VariantProps } from 'class-variance-authority';

export const chatTriggerVariants = cva(
  'fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary-600 text-white shadow-(--brand-shadow-lg) transition-all duration-300 hover:bg-brand-primary-700 hover:scale-110 active:scale-95',
  {
    variants: {
      isOpen: {
        true: 'rotate-90',
        false: 'rotate-0',
      },
    },
    defaultVariants: {
      isOpen: false,
    },
  },
);

export type ChatTriggerVariantsProps = VariantProps<typeof chatTriggerVariants>;
