import {
  Pressable,
  PressableProps,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { TextField } from '../TextField';
import { useTheme } from '@/src/hooks/useTheme';

export interface SocialButtonProps extends Omit<PressableProps, 'style'> {
  label?: string;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const SocialButton = ({ label, icon, style, ...props }: SocialButtonProps) => {
  const t = useTheme();
  const content = label ?? icon;

  return (
    <Pressable
      style={({ pressed }) => [
        s.base,
        {
          borderColor: t.border,
          backgroundColor: t.surfaceElevated,
          opacity: pressed ? 0.7 : 1,
        },
        style,
      ]}
      {...props}
    >
      <TextField variant="body" style={[s.label, { color: t.textPrimary }]}>
        {content}
      </TextField>
    </Pressable>
  );
};

const s = StyleSheet.create({
  base: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
  },
  label: { fontWeight: '600' },
});

export default SocialButton;
