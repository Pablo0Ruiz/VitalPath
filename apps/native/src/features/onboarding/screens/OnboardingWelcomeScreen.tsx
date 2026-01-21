import { OnboardingContent, OnboardingHero } from '@/components/ui/molecules';
import { ImageSourcePropType, Text, View } from 'react-native';

export interface OnboardingWelcomeScreenProps {
  imageSource: ImageSourcePropType;
  onGetStarted: () => void;
}

const OnboardingWelcomeScreen = ({
  imageSource,
  onGetStarted,
}: OnboardingWelcomeScreenProps) => {
  return (
    <View className="relative flex flex-col justify-between overflow-hidden">
      <OnboardingHero
        imageSource={imageSource}
        imageAlt="3D friendly medical robot assistant floating with soft blue lights"
      />
      <OnboardingContent
        headline="Your Health, Simplified"
        highlightedText="Simplified"
        bodyText="Experience the future of healthcare with our AI-driven assistant. Personalized care plans and instant answers."
        currentPage={1}
        totalPages={3}
        buttonTitle="Get Started"
        buttonIcon={
          <Text className="text-[#0f1819] text-xl font-medium">↗</Text>
        }
        onButtonPress={onGetStarted}
      />
    </View>
  );
};

export default OnboardingWelcomeScreen;
