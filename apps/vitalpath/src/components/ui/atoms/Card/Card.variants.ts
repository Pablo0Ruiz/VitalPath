import { ViewStyle } from 'react-native';
import { ThemeTokens } from '@/src/constants/tokens';

export type CardVariant = 'default' | 'elevated' | 'flat';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export const cardVariantStyle = (
  variant: CardVariant,
  t: ThemeTokens,
): ViewStyle => {
  const map: Record<CardVariant, ViewStyle> = {
    default: {
      backgroundColor: t.surface,
      borderWidth: 1,
      borderColor: t.border,
    },
    elevated: {
      backgroundColor: t.surfaceElevated,
      borderWidth: 1,
      borderColor: t.primary100,
    },
    flat: { backgroundColor: t.surface },
  };
  return map[variant];
};

export const cardPaddingStyle: Record<CardPadding, ViewStyle> = {
  none: { padding: 0 },
  sm: { padding: 12 },
  md: { padding: 16 },
  lg: { padding: 24 },
};
