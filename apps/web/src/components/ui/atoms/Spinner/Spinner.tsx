import { HugeiconsIcon } from '@hugeicons/react';
import { Loading02Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

type SpinnerTone = 'brand' | 'neutral' | 'inverse';

type SpinnerProps = {
  tone?: SpinnerTone;
  size?: number;
  className?: string;
};

const toneMap: Record<SpinnerTone, string> = {
  brand: 'text-brand-primary-600',
  neutral: 'text-brand-neutral-400',
  inverse: 'text-brand-text-inverse',
};

const Spinner = ({ tone = 'brand', size = 20, className }: SpinnerProps) => {
  return (
    <HugeiconsIcon
      icon={Loading02Icon}
      size={size}
      className={cn('animate-spin', toneMap[tone], className)}
    />
  );
};

export default Spinner;
