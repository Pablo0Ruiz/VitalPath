import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { cardVariants } from './Card.variants';

type CardProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants>;

const Card = ({
  className,
  padding,
  interactive,
  glass,
  elevated,
  children,
  ...props
}: CardProps) => {
  return (
    <div
      className={cn(
        cardVariants({ padding, interactive, glass, elevated }),
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
