import { cva, type VariantProps } from 'class-variance-authority';

export const chatMessageVariants = cva(
  'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm transition-all',
  {
    variants: {
      role: {
        user: 'bg-brand-primary-600 text-white rounded-br-none',
        assistant:
          'bg-white border border-brand-border text-brand-text-primary rounded-bl-none',
      },
    },
    defaultVariants: {
      role: 'assistant',
    },
  },
);

export const messageContainerVariants = cva('flex group duration-300', {
  variants: {
    role: {
      user: 'justify-end',
      assistant: 'justify-start',
    },
  },
  defaultVariants: {
    role: 'assistant',
  },
});

export type ChatMessageVariantsProps = VariantProps<typeof chatMessageVariants>;
