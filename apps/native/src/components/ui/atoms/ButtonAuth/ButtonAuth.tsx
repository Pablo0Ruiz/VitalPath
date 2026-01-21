import { Pressable, PressableProps, Text, View } from 'react-native';
import { buttonAuthVariants } from './ButtonAuth.variants';

export interface ButtonAuthProps extends PressableProps {
  title: string;
  onPress: () => void;
  icon?: React.ReactNode;
}

const ButtonAuth = ({
  title,
  onPress,
  icon,
  className,
  ...props
}: ButtonAuthProps) => {
  return (
    <Pressable
      className={`${buttonAuthVariants.base} ${className || ''}`}
      onPress={onPress}
      {...props}
    >
      <Text className={buttonAuthVariants.text}>{title}</Text>
      {icon && <View className={buttonAuthVariants.iconContainer}>{icon}</View>}
    </Pressable>
  );
};

export default ButtonAuth;
