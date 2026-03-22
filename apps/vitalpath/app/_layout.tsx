import { SafeAreaView } from 'react-native-safe-area-context';
import 'react-native-reanimated';
import { useColorScheme } from 'nativewind';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import { StatusBar } from 'expo-status-bar';

import { themes } from '@/src/constants/theme';
import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '@/src/context/AuthContext';

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  const [loaded, error] = useFonts({
    'Inter_18pt-Light': require('../assets/fonts/Inter_18pt-Light.ttf'),
    'Inter_18pt-LightItalic': require('../assets/fonts/Inter_18pt-LightItalic.ttf'),
    'Inter_18pt-Regular': require('../assets/fonts/Inter_18pt-Regular.ttf'),
    'Inter_18pt-Thin': require('../assets/fonts/Inter_18pt-Thin.ttf'),
    'Inter_18pt-ThinItalic': require('../assets/fonts/Inter_18pt-ThinItalic.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      if (error) console.error('Error cargando fuentes:', error);
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <AuthProvider>
      <SafeAreaView style={[{ flex: 1 }, themes[colorScheme ?? 'light']]}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <QueryClientProvider client={queryClient}>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </QueryClientProvider>
      </SafeAreaView>
    </AuthProvider>
  );
}
