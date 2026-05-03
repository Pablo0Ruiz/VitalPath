import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export type AvatarSize = 'sm' | 'md' | 'lg';

export const avatarSizeStyles = StyleSheet.create<
  Record<AvatarSize, ViewStyle>
>({
  sm: { width: 32, height: 32 },
  md: { width: 44, height: 44 },
  lg: { width: 56, height: 56 },
});

export const avatarTextStyles = StyleSheet.create<
  Record<AvatarSize, TextStyle>
>({
  sm: { fontSize: 12, fontWeight: '700' },
  md: { fontSize: 14, fontWeight: '700' },
  lg: { fontSize: 16, fontWeight: '700' },
});
