import {
  ActivityIndicator,
  Platform,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  ViewStyle,
  StyleProp,
} from 'react-native';
import {
  buttonContainerStyle,
  getButtonSizeStyle,
  buttonTitleStyle,
  getButtonTitleSizeStyle,
  buttonLoadingColor,
  type ButtonVariant,
  type ButtonSize,
} from './Button.variants';
import { useTheme } from '@/src/hooks/useTheme';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  title?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingPosition?: 'left' | 'right';
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingPosition = 'left',
  children,
  disabled,
  style,
  ...props
}: ButtonProps) => {
  const t = useTheme();

  const spinner = loading ? (
    <ActivityIndicator size="small" color={buttonLoadingColor(variant, t)} />
  ) : null;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      android_ripple={
        Platform.OS === 'android'
          ? {
              color: variant === 'ghost' ? t.primary100 : t.primary200,
              borderless: false,
            }
          : undefined
      }
      style={({ pressed }) => [
        s.base,
        getButtonSizeStyle(size, t),
        buttonContainerStyle(variant, t),
        {
          opacity: loading ? 0.6 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
        style,
      ]}
      {...props}
    >
      {loading && loadingPosition === 'left' && spinner}
      {title && (
        <Text
          style={[
            s.title,
            getButtonTitleSizeStyle(size, t),
            buttonTitleStyle(variant, t),
          ]}
        >
          {title}
        </Text>
      )}
      {children}
      {loading && loadingPosition === 'right' && spinner}
    </Pressable>
  );
};

const s = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  title: { fontWeight: '600' },
});

export default Button;
