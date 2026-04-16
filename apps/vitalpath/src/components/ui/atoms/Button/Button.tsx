import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  Text,
} from 'react-native';
import { buttonVariants, buttonTitle } from './Button.variants';
import { VariantProps } from 'class-variance-authority';

export interface ButtonProps
  extends PressableProps, VariantProps<typeof buttonVariants> {
  title?: string;
  onPress?: () => void;
  loading?: boolean;
  children?: React.ReactNode;
}

const loadingColor: Record<string, string> = {
  primary: '#ffffff',
  secondary: '#ffffff',
  outline: '#7c3aed',
  ghost: '#7c3aed',
  danger: '#dc2626',
};

const Button = ({
  title,
  onPress,
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`${buttonVariants({ variant, size })} ${className ?? ''}`}
      style={({ pressed }) => ({ opacity: pressed || loading ? 0.75 : 1 })}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={loadingColor[variant ?? 'primary']} />
      ) : (
        <>
          <Text className={buttonTitle({ variant, size })}>{title}</Text>
          {children}
        </>
      )}
    </Pressable>
  );
};

export default Button;
