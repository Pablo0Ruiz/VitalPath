import { useRouter, useRootNavigationState } from 'expo-router';
import { useAuthStore } from '@repo/store';
import { useEffect } from 'react';

export default function Index() {
  const user = useAuthStore(state => state.user);
  const isLoading = useAuthStore(state => state.isLoading);
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key || isLoading) return;

    if (user) {
      router.replace('/(tabs)/home');
    } else {
      router.replace('/(auth)/login');
    }
  }, [isLoading, user, router, navigationState?.key]);

  return null;
}
