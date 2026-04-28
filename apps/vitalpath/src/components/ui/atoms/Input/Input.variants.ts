import { ViewStyle, TextStyle } from 'react-native';
import { ThemeTokens } from '@/src/constants/tokens';

export type InputVariant = 'default' | 'error' | 'bare';

export const inputContainerStyle = (
  variant: InputVariant,
  t: ThemeTokens,
): ViewStyle => {
  const map: Record<InputVariant, ViewStyle> = {
    default: { borderWidth: 1, borderColor: t.border },
    error: { borderWidth: 1, borderColor: t.error },
    bare: { flex: 1 },
  };
  return map[variant];
};

export const inputTextStyle = (
  variant: InputVariant,
  t: ThemeTokens,
): TextStyle => {
  const base: TextStyle = { flex: 1, color: t.textPrimary, letterSpacing: 0.3 };
  if (variant === 'bare') return { ...base, fontSize: 14 };
  return { ...base, paddingVertical: 12, fontSize: 16 };
};
