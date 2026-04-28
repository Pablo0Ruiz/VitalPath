import { Stack } from 'expo-router';
import { AUTH_REGISTER_ROUTES } from '@/src/routes/routes';
import { BackButton } from '@/src/components/ui/atoms/BackButton';

export default function RegisterLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTransparent: true,
        headerTitle: '',
        headerLeft: () => <BackButton />,
        animation: 'slide_from_right',
        animationDuration: 320,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen name="index" />
      {AUTH_REGISTER_ROUTES.map(route => (
        <Stack.Screen
          key={route.screenName}
          name={route.screenName}
          options={{ title: route.title }}
        />
      ))}
    </Stack>
  );
}
