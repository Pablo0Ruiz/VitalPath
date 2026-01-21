import OnboardingWelcomeScreen from '@/features/onboarding/screens/OnboardingWelcomeScreen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import './global.css';
import { Alert } from 'react-native';

const robot = require('./assets/images/robot.png');

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-white">
        <OnboardingWelcomeScreen
          imageSource={robot}
          onGetStarted={() => {
            Alert.alert('Get Started');
          }}
        />
      </SafeAreaView>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
