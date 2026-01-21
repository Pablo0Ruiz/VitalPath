import { Image, ImageSourcePropType, View, ViewProps } from 'react-native';
import { onboardingHeroVariants } from './OnboardingHero.variants';

export interface OnboardingHeroProps extends ViewProps {
  imageSource: ImageSourcePropType;
  imageAlt?: string;
}

const OnboardingHero = ({
  imageSource,
  imageAlt,
  className,
  ...props
}: OnboardingHeroProps) => {
  return (
    <>
      <View className={onboardingHeroVariants.bgGradient} />
      <View className={onboardingHeroVariants.bgBlur} />
      <View
        className={`${onboardingHeroVariants.container} ${className || ''}`}
        {...props}
      >
        <View className={onboardingHeroVariants.wrapper}>
          <View className={onboardingHeroVariants.imageContainer}>
            <Image
              source={imageSource}
              resizeMode="contain"
              style={{ width: 500, height: 500 }}
              accessibilityLabel={imageAlt}
            />
            <View className={onboardingHeroVariants.overlay} />
          </View>
        </View>
      </View>
    </>
  );
};

export default OnboardingHero;
