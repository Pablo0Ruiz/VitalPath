import { StyleSheet, ViewStyle } from 'react-native';

export type GradientHeroSize = 'tall' | 'short' | 'card';

export const gradientHeroSizeStyles = StyleSheet.create<
  Record<GradientHeroSize, ViewStyle>
>({
  tall: {
    height: 256,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  short: {
    height: 160,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  card: { height: 128, borderRadius: 16 },
});
