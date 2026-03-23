import { Stack } from 'expo-router';
import { AUTH_ROUTES } from '@/src/routes/routes';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {AUTH_ROUTES.map(route => (
        <Stack.Screen
          key={route.screenName}
          name={route.screenName}
          options={{ title: route.title }}
        />
      ))}
    </Stack>
  );
}
