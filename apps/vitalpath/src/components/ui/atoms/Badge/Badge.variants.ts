export const baseBadge = 'flex-row items-center px-2 py-0.5 rounded-full';

export const badgeVariants = {
  success: {
    container: 'bg-green-100',
    text: 'text-green-600 text-xs font-semibold',
  },
  error: {
    container: 'bg-red-100',
    text: 'text-red-500 text-xs font-semibold',
  },
  warning: {
    container: 'bg-amber-100',
    text: 'text-amber-500 text-xs font-semibold',
  },
  primary: {
    container: 'bg-brand-violet-100',
    text: 'text-brand-violet-600 text-xs font-semibold',
  },
  secondary: {
    container: 'bg-brand-teal-100',
    text: 'text-brand-teal-600 text-xs font-semibold',
  },
  neutral: {
    container: 'bg-brand-slate-100',
    text: 'text-brand-slate-500 text-xs font-semibold',
  },
} as const;
