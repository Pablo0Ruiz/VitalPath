import * as Sentry from '@sentry/react-native';
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
import { useAuthStore } from '@/src/stores/auth';
import { useSession } from '@repo/api-client';
import { mobileTokenAdapter } from '@/src/adapters/mobileTokenAdapter';

import { setupApiInterceptors } from '@/src/lib/api-setup';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTheme } from '@/src/hooks/useTheme';
import { useSeniorUIStore } from '@/src/stores/seniorUI.store';
import { VersionGate } from '@/src/components/ui/organisms/VersionGate';

setupApiInterceptors();

if (process.env.EXPO_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    enabled: !__DEV__,
    tracesSampleRate: 0,
    sendDefaultPii: false,
  });
}

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

function AuthInitializer() {
  const { user, setSession, clearSession, setIsLoading, _hasHydrated } =
    useAuthStore();
  const { syncWithUser, reset: resetSeniorUI } = useSeniorUIStore();

  useEffect(() => {
    if (_hasHydrated) return;

    const unsub = useAuthStore.persist.onFinishHydration(() => {
      useAuthStore.getState().setHasHydrated();
    });

    const timeout = setTimeout(() => {
      if (!useAuthStore.getState()._hasHydrated) {
        useAuthStore.getState().setHasHydrated();
      }
    }, 3000);

    return () => {
      unsub();
      clearTimeout(timeout);
    };
  }, [_hasHydrated]);

  useSession(
    mobileTokenAdapter,
    { setSession, clearSession, setIsLoading },
    { enabled: _hasHydrated },
  );

  useEffect(() => {
    if (user) {
      syncWithUser(user);
      Sentry.setUser({ id: user._id, role: user.role });
    } else {
      resetSeniorUI();
      Sentry.setUser(null);
    }
  }, [user, syncWithUser, resetSeniorUI]);

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
    'PlusJakartaSans-Italic-VariableFont_wght': require('../assets/fonts/PlusJakartaSans-Italic-VariableFont_wght.ttf'),
    'PlusJakartaSans-VariableFont_wght': require('../assets/fonts/PlusJakartaSans-VariableFont_wght.ttf'),
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
        <VersionGate>
          <View style={{ flex: 1, backgroundColor: t.background }}>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(drawer)" />
            </Stack>
          </View>
        </VersionGate>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export default Sentry.wrap(RootLayout);
