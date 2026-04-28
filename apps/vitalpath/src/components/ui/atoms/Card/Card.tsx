import { StyleSheet, View, ViewProps } from 'react-native';
import {
  cardVariantStyle,
  cardPaddingStyle,
  type CardVariant,
  type CardPadding,
} from './Card.variants';
import { useTheme } from '@/src/hooks/useTheme';

export interface CardProps extends ViewProps {
  variant?: CardVariant;
  padding?: CardPadding;
}

const Card = ({
  variant = 'default',
  padding = 'md',
  style,
  ...props
}: CardProps) => {
  const t = useTheme();
  return (
    <View
      style={[
        s.base,
        cardVariantStyle(variant, t),
        cardPaddingStyle[padding],
        style,
      ]}
      {...props}
    />
  );
};

const s = StyleSheet.create({
  base: { borderRadius: 16 },
});

export default Card;
