'use client';

import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import { cn } from '@/lib/utils';

type Tab = {
  value: string;
  label: string;
  icon?: IconSvgElement;
};

type TabsProps = {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
  variant?: 'pill' | 'underline';
  className?: string;
};

const Tabs = ({
  tabs,
  value,
  onChange,
  variant = 'pill',
  className,
}: TabsProps) => {
  if (variant === 'underline') {
    return (
      <div className={cn('flex border-b border-brand-border gap-1', className)}>
        {tabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px',
              value === tab.value
                ? 'border-brand-primary-600 text-brand-primary-600'
                : 'border-transparent text-brand-text-secondary hover:text-brand-text-primary',
            )}
          >
            {tab.icon && <HugeiconsIcon icon={tab.icon} size={16} />}
            {tab.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex gap-1 p-1 bg-brand-neutral-100 rounded-lg',
        className,
      )}
    >
      {tabs.map(tab => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
            value === tab.value
              ? 'bg-brand-background text-brand-primary-700 shadow-(--brand-shadow-sm)'
              : 'text-brand-text-secondary hover:text-brand-text-primary',
          )}
        >
          {tab.icon && <HugeiconsIcon icon={tab.icon} size={16} />}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
