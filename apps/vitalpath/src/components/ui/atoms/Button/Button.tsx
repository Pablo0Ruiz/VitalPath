import { Pressable, PressableProps, Text } from 'react-native';
import { buttonVariants, baseButton, buttonTitle } from './Button.variants';

export interface ButtonProps extends PressableProps {
  title: string;
  onPress?: () => void;
  variant?: keyof typeof buttonVariants;
}

const Button = ({
  title,
  onPress,
  className,
  variant = 'primary',
  ...props
}: ButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      className={`${baseButton} ${buttonVariants[variant]} ${className ?? ''}`}
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
      {...props}
    >
      <Text className={buttonTitle[variant]}>{title}</Text>
    </Pressable>
  );
};

export default Button;
