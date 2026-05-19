import { cloneElement, isValidElement, useId } from 'react';
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
  const generatedId = useId();
  const inputId = generatedId + '-input';
  const errorId = generatedId + '-error';
  const hintId = generatedId + '-hint';

  const describedBy = error ? errorId : hint ? hintId : undefined;

  const enhancedChild = isValidElement(children)
    ? cloneElement(children as React.ReactElement<Record<string, unknown>>, {
        id: (children.props as Record<string, unknown>).id ?? inputId,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
      })
    : children;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-brand-text-primary"
        >
          {label}
        </label>
      )}
      {enhancedChild}
      {error && (
        <div className="flex items-center gap-1">
          <HugeiconsIcon
            icon={AlertCircleIcon}
            size={14}
            className="text-brand-state-error shrink-0"
          />
          <span
            id={errorId}
            role="alert"
            className="text-xs text-brand-state-error"
          >
            {error}
          </span>
        </div>
      )}
      {!error && hint && (
        <span id={hintId} className="text-xs text-brand-text-secondary">
          {hint}
        </span>
      )}
    </div>
  );
};

export default FormField;
