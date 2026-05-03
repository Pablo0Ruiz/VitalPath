import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewProps,
  useColorScheme,
} from 'react-native';
import {
  inputContainerStyle,
  inputTextStyle,
  type InputVariant,
} from './Input.variants';
import { useTheme } from '@/src/hooks/useTheme';

export interface InputProps extends TextInputProps {
  containerStyle?: ViewProps['style'];
  variant?: InputVariant;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = ({
  containerStyle,
  placeholder,
  variant = 'default',
  leftIcon,
  rightIcon,
  style,
  ...props
}: InputProps) => {
  const t = useTheme();
  const colorScheme = useColorScheme();
  const placeholderColor = colorScheme === 'dark' ? t.neutral600 : t.neutral400;

  return (
    <View
      style={[s.container, inputContainerStyle(variant, t), containerStyle]}
    >
      {leftIcon && <View style={s.iconLeft}>{leftIcon}</View>}
      <TextInput
        style={[inputTextStyle(variant, t), style]}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        {...props}
      />
      {rightIcon && <View style={s.iconRight}>{rightIcon}</View>}
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  iconLeft: { marginRight: 12, opacity: 0.5 },
  iconRight: { marginLeft: 12, opacity: 0.5 },
});

export default Input;
