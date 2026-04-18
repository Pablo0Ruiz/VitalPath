'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { Tick02Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
};

const Checkbox = ({
  checked,
  onChange,
  label,
  error,
  disabled,
  className,
}: CheckboxProps) => {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <button
          type="button"
          role="checkbox"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => onChange(!checked)}
          className={cn(
            'w-4 h-4 rounded flex items-center justify-center border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-600',
            checked
              ? 'bg-brand-primary-600 border-brand-primary-600'
              : 'bg-brand-background border-brand-border',
            error && !checked && 'border-brand-state-error',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
        >
          {checked && (
            <HugeiconsIcon icon={Tick02Icon} size={12} className="text-white" />
          )}
        </button>
        {label && (
          <span className="text-sm text-brand-text-primary">{label}</span>
        )}
      </label>
      {error && <span className="text-xs text-brand-state-error">{error}</span>}
    </div>
  );
};

export default Checkbox;
