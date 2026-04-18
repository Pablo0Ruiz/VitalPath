'use client';

import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import { cn } from '@/lib/utils';
import { inputVariants } from './Input.variants';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  leftIcon?: IconSvgElement;
  rightIcon?: IconSvgElement;
  error?: boolean;
};

const Input = ({
  className,
  leftIcon,
  rightIcon,
  error,
  ref,
  ...props
}: InputProps & { ref?: React.Ref<HTMLInputElement> }) => {
  return (
    <div className="relative flex items-center">
      {leftIcon && (
        <span className="absolute left-3 flex items-center text-brand-neutral-400 pointer-events-none">
          <HugeiconsIcon icon={leftIcon} size={16} />
        </span>
      )}
      <input
        className={cn(
          inputVariants({
            error: !!error,
            hasLeftIcon: !!leftIcon,
            hasRightIcon: !!rightIcon,
          }),
          'h-10',
          className,
        )}
        {...props}
        ref={ref}
      />
      {rightIcon && (
        <span className="absolute right-3 flex items-center text-brand-neutral-400">
          <HugeiconsIcon icon={rightIcon} size={16} />
        </span>
      )}
    </div>
  );
};

Input.displayName = 'Input';

export default Input;
