import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import './global.css';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center bg-white">
          <Text className="text-xl font-bold text-black">¡Hola VitalPath!</Text>
          <Text className="text-base text-gray-600 mt-2">
            NativeWind funcionando
          </Text>
        </View>
      </SafeAreaView>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
