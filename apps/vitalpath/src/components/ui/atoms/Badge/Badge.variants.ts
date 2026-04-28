import { ViewStyle, TextStyle } from 'react-native';
import { ThemeTokens } from '@/src/constants/tokens';

export type BadgeVariant =
  | 'success'
  | 'error'
  | 'warning'
  | 'primary'
  | 'secondary'
  | 'neutral'
  | 'new'
  | 'outline';

export const badgeContainerStyle = (
  variant: BadgeVariant,
  t: ThemeTokens,
): ViewStyle => {
  const map: Record<BadgeVariant, ViewStyle> = {
    success: { backgroundColor: t.successLight },
    error: { backgroundColor: t.errorLight },
    warning: { backgroundColor: t.warningLight },
    primary: { backgroundColor: t.primary100 },
    secondary: { backgroundColor: t.secondary100 },
    neutral: { backgroundColor: t.neutral100 },
    new: { backgroundColor: t.primary600 },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: t.border,
    },
  };
  return map[variant];
};

export const badgeTextStyle = (
  variant: BadgeVariant,
  t: ThemeTokens,
): TextStyle => {
  const map: Record<BadgeVariant, TextStyle> = {
    success: { color: t.success },
    error: { color: t.error },
    warning: { color: t.warning },
    primary: { color: t.primary600 },
    secondary: { color: t.secondary600 },
    neutral: { color: t.neutral500 },
    new: {
      color: '#FFFFFF',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      fontSize: 10,
    },
    outline: { color: t.textPrimary },
  };
  return map[variant];
};
