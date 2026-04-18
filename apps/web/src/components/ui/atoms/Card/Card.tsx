import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { cardVariants } from './Card.variants';

type CardProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants>;

const Card = ({ className, padding, children, ...props }: CardProps) => {
  return (
    <div className={cn(cardVariants({ padding }), className)} {...props}>
      {children}
    </div>
  );
};

export default Card;
