import { ViewStyle, TextStyle } from 'react-native';
import { ThemeTokens } from '@/src/constants/tokens';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'ghost-on-dark'
  | 'danger';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export const buttonContainerStyle = (
  variant: ButtonVariant,
  t: ThemeTokens,
): ViewStyle => {
  const map: Record<ButtonVariant, ViewStyle> = {
    primary: { backgroundColor: t.neutral950 },
    secondary: { backgroundColor: '#F1F5F9' },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: t.neutral950,
    },
    ghost: { backgroundColor: 'transparent' },
    'ghost-on-dark': { backgroundColor: 'rgba(255,255,255,0.1)' },
    danger: { backgroundColor: '#FEE2E2' },
  };
  return map[variant];
};

export const buttonSizeStyle: Record<ButtonSize, ViewStyle> = {
  xs: { paddingHorizontal: 10, paddingVertical: 6, gap: 6 },
  sm: { paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
  md: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  lg: { paddingHorizontal: 20, paddingVertical: 16, gap: 8 },
};

export const buttonTitleStyle = (
  variant: ButtonVariant,
  t: ThemeTokens,
): TextStyle => {
  const colorMap: Record<ButtonVariant, string> = {
    primary: '#FFFFFF',
    secondary: t.neutral950,
    outline: t.neutral950,
    ghost: t.neutral950,
    'ghost-on-dark': '#FFFFFF',
    danger: '#DC2626',
  };
  return { color: colorMap[variant], fontWeight: '600' };
};

export const buttonTitleSizeStyle: Record<ButtonSize, TextStyle> = {
  xs: { fontSize: 12 },
  sm: { fontSize: 14 },
  md: { fontSize: 16 },
  lg: { fontSize: 16 },
};

export const buttonLoadingColor = (
  variant: ButtonVariant,
  t: ThemeTokens,
): string => {
  const map: Record<ButtonVariant, string> = {
    primary: '#FFFFFF',
    secondary: '#FFFFFF',
    outline: t.primary600,
    ghost: t.primary600,
    'ghost-on-dark': '#FFFFFF',
    danger: '#DC2626',
  };
  return map[variant];
};
