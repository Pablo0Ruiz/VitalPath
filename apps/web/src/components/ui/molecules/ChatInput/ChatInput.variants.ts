import { cva } from 'class-variance-authority';

export const chatInputContainerVariants = cva(
  'px-5 py-5 border-t border-brand-border/50 bg-brand-surface/30 shrink-0',
);

export const chatInputWrapperVariants = cva(
  'flex items-end gap-2 rounded-2xl border border-brand-border bg-white p-2 shadow-inner transition-all duration-200 focus-within:ring-2 focus-within:ring-brand-primary-500/20 focus-within:border-brand-primary-500/50',
  {
    variants: {
      isLoading: {
        true: 'opacity-70 pointer-events-none',
        false: 'opacity-100',
      },
    },
    defaultVariants: {
      isLoading: false,
    },
  },
);

export const chatInputTextareaVariants = cva(
  'flex-1 resize-none bg-transparent py-1.5 px-2 text-sm outline-none text-brand-text-primary placeholder:text-brand-text-secondary min-h-[24px] max-h-[120px] overflow-y-auto',
);

export const chatInputButtonVariants = cva(
  'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-primary-600 text-white shadow-md shadow-brand-primary-200 transition-all active:scale-90 hover:bg-brand-primary-700 disabled:bg-brand-neutral-200 disabled:text-brand-neutral-400 disabled:shadow-none disabled:cursor-not-allowed',
);
