import { Pressable, PressableProps, Text, View } from 'react-native';
import { buttonOnBoardingVariants } from './ButtonOnboarding.variants';

export interface ButtonOnBoardingProps extends PressableProps {
  title: string;
  onPress: () => void;
  icon?: React.ReactNode;
}

const ButtonOnBoarding = ({
  title,
  onPress,
  icon,
  className,
  ...props
}: ButtonOnBoardingProps) => {
  return (
    <Pressable
      className={`${buttonOnBoardingVariants.base} ${className || ''}`}
      onPress={onPress}
      {...props}
    >
      <Text className={buttonOnBoardingVariants.text}>{title}</Text>
      {icon && (
        <View className={buttonOnBoardingVariants.iconContainer}>{icon}</View>
      )}
    </Pressable>
  );
};

export default ButtonOnBoarding;
