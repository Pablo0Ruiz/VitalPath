import { StyleSheet, ViewStyle } from 'react-native';
import { ThemeTokens } from '@/src/constants/tokens';

export const checkboxContainerStyle = (
  checked: boolean,
  t: ThemeTokens,
): ViewStyle => {
  return {
    backgroundColor: checked ? t.primary600 : t.surface,
    borderColor: checked ? t.primary600 : t.border,
  };
};

export const checkboxBaseStyles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
