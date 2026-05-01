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

export const getButtonSizeStyle = (
  size: ButtonSize,
  t: ThemeTokens,
): ViewStyle => {
  const map: Record<ButtonSize, ViewStyle> = {
    xs: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      minHeight: 32,
      gap: 6,
    },
    sm: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      minHeight: 40,
      gap: 8,
    },
    md: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      minHeight: t.minTouchTarget,
      gap: 8,
    },
    lg: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      minHeight: Math.max(t.minTouchTarget, 56),
      gap: 8,
    },
  };
  return map[size];
};

export const buttonTitleStyle = (
  variant: ButtonVariant,
  t: ThemeTokens,
): TextStyle => {
  const colorMap: Record<ButtonVariant, string> = {
    primary: t.white,
    secondary: t.neutral950,
    outline: t.neutral950,
    ghost: t.neutral950,
    'ghost-on-dark': t.white,
    danger: t.error,
  };
  return { color: colorMap[variant], fontWeight: '600' };
};

export const getButtonTitleSizeStyle = (
  size: ButtonSize,
  t: ThemeTokens,
): TextStyle => {
  const map: Record<ButtonSize, TextStyle> = {
    xs: { fontSize: t.fontSizeCaption },
    sm: { fontSize: t.fontSizeBody },
    md: { fontSize: t.fontSizeBody },
    lg: { fontSize: t.fontSizeBody },
  };
  return map[size];
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
