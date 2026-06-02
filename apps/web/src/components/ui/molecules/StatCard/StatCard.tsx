import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import { ArrowUp01Icon, ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { Card } from '@/components/ui/atoms/Card';
import { cn } from '@/lib/utils';

import type { VariantProps } from 'class-variance-authority';
import {
  statCardAccentVariants,
  statCardIconVariants,
} from './StatCard.variants';

type StatCardProps = {
  icon: IconSvgElement;
  value: string | number;
  label: string;
  delta?: {
    value: number;
    direction: 'up' | 'down';
  };
  tone?: VariantProps<typeof statCardAccentVariants>['tone'];
  className?: string;
};

const StatCard = ({
  icon,
  value,
  label,
  delta,
  tone = 'brand',
  className,
}: StatCardProps) => {
  return (
    <Card
      interactive
      className={cn(
        'relative overflow-hidden flex flex-col gap-3 pt-6',
        className,
      )}
    >
      <div className={statCardAccentVariants({ tone })} />

      <div className={statCardIconVariants({ tone })}>
        <HugeiconsIcon icon={icon} size={20} />
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="text-[2rem] font-extrabold leading-none tracking-[-0.02em] text-brand-text-primary">
          {value}
        </span>
        <span className="text-xs font-medium text-brand-text-secondary uppercase tracking-wide">
          {label}
        </span>
      </div>
      {delta && (
        <div
          className={cn(
            'self-start inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full',
            delta.direction === 'up'
              ? 'bg-brand-state-success-light text-brand-state-success-dark dark:bg-brand-state-success-light/20 dark:text-brand-state-success'
              : 'bg-brand-state-error-light text-brand-state-error-dark dark:bg-brand-state-error-light/20 dark:text-brand-state-error',
          )}
        >
          <HugeiconsIcon
            icon={delta.direction === 'up' ? ArrowUp01Icon : ArrowDown01Icon}
            size={11}
          />
          {Math.abs(delta.value)}%
        </div>
      )}
    </Card>
  );
};

export default StatCard;
