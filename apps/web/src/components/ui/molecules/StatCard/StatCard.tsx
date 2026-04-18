import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { Card } from '@/components/ui/atoms/Card';
import { IconBox } from '@/components/ui/atoms/IconBox';
import { cn } from '@/lib/utils';

type StatCardProps = {
  icon: IconSvgElement;
  value: string | number;
  label: string;
  delta?: {
    value: number;
    direction: 'up' | 'down';
  };
  tone?: 'brand' | 'success' | 'warning' | 'error' | 'neutral';
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
    <Card className={cn('flex items-start gap-4', className)}>
      <IconBox icon={icon} tone={tone} size="md" />
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-2xl font-bold text-brand-text-primary leading-none">
          {value}
        </span>
        <span className="text-sm text-brand-text-secondary">{label}</span>
        {delta && (
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-medium',
              delta.direction === 'up'
                ? 'text-brand-state-success-dark'
                : 'text-brand-state-error',
            )}
          >
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={12}
              className={cn(delta.direction === 'down' && 'rotate-180')}
            />
            {Math.abs(delta.value)}%
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
