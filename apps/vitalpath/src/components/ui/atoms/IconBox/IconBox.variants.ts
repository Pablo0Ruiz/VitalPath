import { StyleSheet, ViewStyle } from 'react-native';

export type IconBoxSize = 'sm' | 'md' | 'lg';

export const iconBoxSizeStyles = StyleSheet.create<
  Record<IconBoxSize, ViewStyle>
>({
  sm: { width: 28, height: 28 },
  md: { width: 32, height: 32 },
  lg: { width: 40, height: 40 },
});
