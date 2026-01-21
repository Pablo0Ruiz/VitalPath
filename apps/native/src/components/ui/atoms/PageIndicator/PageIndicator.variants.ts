const base = 'h-2 rounded-full transition-all duration-300';
const active = 'w-8 bg-[#131616] dark:bg-primary';
const inactive = 'w-2 bg-[#cbd5e1] dark:bg-gray-700';

export const pageIndicatorVariants = {
  active: {
    base: `${base} ${active}`,
  },
  inactive: {
    base: `${base} ${inactive}`,
  },
};

export type PageIndicatorVariants = typeof pageIndicatorVariants;
