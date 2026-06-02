import { StyleSheet, ViewStyle } from 'react-native';

export type GradientHeroSize = 'tall' | 'short' | 'card' | 'banner';

export const gradientHeroSizeStyles = StyleSheet.create<
  Record<GradientHeroSize, ViewStyle>
>({
  tall: {
    height: 256,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  short: {
    height: 160,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  card: { height: 128, borderRadius: 16 },
  banner: {
    height: 160,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});
