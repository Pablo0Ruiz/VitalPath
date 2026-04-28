import {
  Pressable,
  PressableProps,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';
import { useTheme } from '@/src/hooks/useTheme';
import {
  checkboxBaseStyles,
  checkboxContainerStyle,
} from './Checkbox.variants';

export interface CheckboxProps extends Omit<PressableProps, 'style'> {
  checked: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const Checkbox = ({
  checked,
  onToggle,
  children,
  style,
  ...props
}: CheckboxProps) => {
  const t = useTheme();

  return (
    <Pressable
      onPress={onToggle}
      style={({ pressed }) => [s.base, { opacity: pressed ? 0.7 : 1 }, style]}
      {...props}
    >
      <View
        style={[
          checkboxBaseStyles.container,
          checkboxContainerStyle(checked, t),
        ]}
      >
        {checked && <Octicons name="check" size={14} color="white" />}
      </View>
      <View style={s.content}>{children}</View>
    </Pressable>
  );
};

const s = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'flex-start' },
  content: { flex: 1 },
});

export default Checkbox;
