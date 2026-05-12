import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { useTheme } from '@/src/hooks/useTheme';

export default function MedicationsLayout() {
  const t = useTheme();

  const onBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(drawer)/(tabs)/home');
    }
  };

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTransparent: true,
        headerTitle: '',
        contentStyle: {
          backgroundColor: t.background,
        },
        headerLeft: () => (
          <Ionicons
            name="arrow-back-outline"
            size={24}
            color={t.textPrimary}
            onPress={onBack}
          />
        ),
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
