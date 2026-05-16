import { cva, type VariantProps } from 'class-variance-authority';

export const floatingChatVariants = cva(
  'fixed bottom-24 right-6 z-50 flex flex-col w-[400px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-brand-background/80 backdrop-blur-xl border border-brand-border rounded-3xl shadow-(--brand-shadow-lg) overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-bottom-right',
  {
    variants: {
      isOpen: {
        true: 'opacity-100 translate-y-0 scale-100 pointer-events-auto',
        false: 'opacity-0 translate-y-4 scale-95 pointer-events-none',
      },
    },
    defaultVariants: {
      isOpen: false,
    },
  },
);

export type FloatingChatVariantsProps = VariantProps<
  typeof floatingChatVariants
>;
