'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: SelectOption[];
  error?: boolean;
  placeholder?: string;
};

const Select = ({
  className,
  options,
  error,
  placeholder,
  ...props
}: SelectProps) => {
  return (
    <div className="relative flex items-center">
      <select
        className={cn(
          'flex w-full h-10 rounded-lg border bg-brand-background text-brand-text-primary text-sm appearance-none pl-3 pr-10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-600 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50',
          error ? 'border-brand-state-error' : 'border-brand-border',
          className,
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <span className="absolute right-3 flex items-center text-brand-neutral-400 pointer-events-none">
        <HugeiconsIcon icon={ArrowDown01Icon} size={16} />
      </span>
    </div>
  );
};

export default Select;
