import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { badgeVariants } from './Badge.variants';

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

const Badge = ({
  className,
  variant,
  size,
  children,
  ...props
}: BadgeProps) => {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
