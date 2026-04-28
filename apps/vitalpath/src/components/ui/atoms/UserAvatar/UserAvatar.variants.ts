import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export type UserAvatarSize = 'sm' | 'md' | 'lg';

export const userAvatarContainerStyles = StyleSheet.create<
  Record<UserAvatarSize, ViewStyle>
>({
  sm: { width: 32, height: 32 },
  md: { width: 44, height: 44 },
  lg: { width: 56, height: 56 },
});

export const userAvatarTextStyles = StyleSheet.create<
  Record<UserAvatarSize, TextStyle>
>({
  sm: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
  md: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  lg: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});

export const userAvatarStatusDotStyles = StyleSheet.create<
  Record<UserAvatarSize, ViewStyle>
>({
  sm: { width: 8, height: 8 },
  md: { width: 12, height: 12 },
  lg: { width: 14, height: 14 },
});

export type UserAvatarVariants = { size?: UserAvatarSize };
