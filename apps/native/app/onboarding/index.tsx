import { OnboardingContent, OnboardingHero } from '@/components/ui/molecules';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const robot = require('../../assets/images/robot.png');

const OnboardingWelcome = () => {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="relative flex flex-col justify-between overflow-hidden">
        <OnboardingHero
          imageSource={robot}
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
          onButtonPress={() => {
            router.push('/auth/login');
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default OnboardingWelcome;
