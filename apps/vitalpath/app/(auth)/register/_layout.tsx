import { Stack } from 'expo-router';
import { useTheme } from '@/src/hooks/useTheme';
import BackButton from '@/src/components/ui/atoms/BackButton/BackButton';

export default function RegisterLayout() {
  const t = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTransparent: true,
        headerTitle: '',
        animation: 'slide_from_right',
        animationDuration: 320,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerBackVisible: false,
          headerLeft: () => null,
          headerTintColor: t.textInverse,
        }}
      />
      <Stack.Screen
        name="step-2"
        options={{
          title: 'Registrarse Step 2',
          headerLeft: () => <BackButton color={t.textInverse} />,
          headerTintColor: t.textInverse,
        }}
      />
      <Stack.Screen
        name="step-3"
        options={{
          title: 'Registrarse Step 3',
          headerLeft: () => <BackButton color={t.textInverse} />,
          headerTintColor: t.textInverse,
        }}
      />
    </Stack>
  );
}
