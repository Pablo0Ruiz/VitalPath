import { View, ViewProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva('rounded-2xl', {
  variants: {
    variant: {
      default: 'bg-brand-surface border border-brand-border',
      elevated: 'bg-white border border-brand-violet-100',
      flat: 'bg-brand-surface',
    },
    padding: {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'md',
  },
});

export interface CardProps
  extends ViewProps, VariantProps<typeof cardVariants> {}

const Card = ({ variant, padding, className, ...props }: CardProps) => {
  return (
    <View
      className={`${cardVariants({ variant, padding })} ${className ?? ''}`}
      {...props}
    />
  );
};

export default Card;
