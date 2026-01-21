import { OnboardingContent, OnboardingHero } from '@/components/ui/molecules';
import { Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const robot = require('../../assets/images/robot.png');

export default function OnboardingWelcome() {
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
            Alert.alert('Get Started');
            // router.push('/onboarding/step2'); // Para navegar a la siguiente pantalla
          }}
        />
      </View>
    </SafeAreaView>
  );
}
