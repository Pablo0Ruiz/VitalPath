import { Pressable, PressableProps, Text } from 'react-native';
import { buttonVariants, buttonTitle } from './Button.variants';

export interface ButtonProps extends PressableProps {
  title?: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  children?: React.ReactNode;
}

const Button = ({
  title,
  onPress,
  className,
  variant = 'primary',
  children,
  ...props
}: ButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      className={`${buttonVariants({ variant })} ${className ?? ''}`}
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
      {...props}
    >
      <Text className={buttonTitle({ variant })}>{title}</Text>
      {children}
    </Pressable>
  );
};

export default Button;
