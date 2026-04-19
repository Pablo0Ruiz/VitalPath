import { Stack } from 'expo-router';
import { AUTH_REGISTER_ROUTES } from '@/src/routes/routes';

export default function RegisterLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 320,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
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
