import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import { Button } from '@/components/ui/atoms/Button';
import { cn } from '@/lib/utils';

type EmptyStateProps = {
  icon: IconSvgElement;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
};

const EmptyState = ({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-16 px-4 text-center',
        className,
      )}
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-neutral-100 text-brand-neutral-400">
        <HugeiconsIcon icon={icon} size={28} />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-base font-semibold text-brand-text-primary">
          {title}
        </span>
        {description && (
          <span className="text-sm text-brand-text-secondary max-w-xs">
            {description}
          </span>
        )}
      </div>
      {action && (
        <Button variant="primary" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
