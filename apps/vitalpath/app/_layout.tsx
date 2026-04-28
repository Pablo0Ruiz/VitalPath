import { View, AppState, AppStateStatus, useColorScheme } from 'react-native';
import 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import {
  QueryClientProvider,
  QueryClient,
  focusManager,
} from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useAuthStore } from '@repo/store';
import { useSession } from '@repo/api-client';
import { mobileTokenAdapter } from '@/src/adapters/mobileTokenAdapter';

import { setupApiInterceptors } from '@/src/lib/api-setup';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTheme } from '@/src/hooks/useTheme';

setupApiInterceptors();

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

function AuthInitializer() {
  const { setSession, clearSession, setIsLoading } = useAuthStore();
  useSession(mobileTokenAdapter, { setSession, clearSession, setIsLoading });
  return null;
}

function RootLayout() {
  const colorScheme = useColorScheme();
  const t = useTheme();

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

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (state: AppStateStatus) => {
        focusManager.setFocused(state === 'active');
      },
    );
    return () => subscription.remove();
  }, []);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthInitializer />
        <View style={{ flex: 1, backgroundColor: t.background }}>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </View>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export default RootLayout;
