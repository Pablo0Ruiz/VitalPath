import { HugeiconsIcon } from '@hugeicons/react';
import { AlertCircleIcon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

type FormFieldProps = {
  label?: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
};

const FormField = ({
  label,
  error,
  hint,
  children,
  className,
}: FormFieldProps) => {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-sm font-medium text-brand-text-primary">
          {label}
        </label>
      )}
      {children}
      {error && (
        <div className="flex items-center gap-1">
          <HugeiconsIcon
            icon={AlertCircleIcon}
            size={14}
            className="text-brand-state-error shrink-0"
          />
          <span className="text-xs text-brand-state-error">{error}</span>
        </div>
      )}
      {!error && hint && (
        <span className="text-xs text-brand-text-secondary">{hint}</span>
      )}
    </div>
  );
};

export default FormField;
