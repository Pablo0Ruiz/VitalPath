import {
  Pressable,
  PressableProps,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/src/hooks/useTheme';

export interface BackButtonProps extends Omit<
  PressableProps,
  'onPress' | 'style'
> {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const BackButton = ({ onPress, style, ...props }: BackButtonProps) => {
  const t = useTheme();

  return (
    <Pressable
      onPress={onPress ?? (() => router.back())}
      accessibilityRole="button"
      accessibilityLabel="Volver"
      style={({ pressed }) => [
        s.base,
        {
          backgroundColor: t.surfaceElevated,
          borderColor: t.border,
          opacity: pressed ? 0.7 : 1,
        },
        style,
      ]}
      {...props}
    >
      <Ionicons name="chevron-back" size={20} color={t.textPrimary} />
    </Pressable>
  );
};

const s = StyleSheet.create({
  base: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
    marginLeft: 16,
  },
});

export default BackButton;
