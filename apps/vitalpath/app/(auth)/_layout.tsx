import { Stack } from 'expo-router';
import { BackButton } from '@/src/components/ui/atoms/BackButton';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="login/index" options={{ headerShown: false }} />

      <Stack.Screen name="register" options={{ headerShown: false }} />

      <Stack.Screen
        name="recover-password/index"
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: '',
          headerLeft: () => <BackButton />,
        }}
      />

      <Stack.Screen
        name="recover-password-email-sent/index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="senior-ui-suggestion/index"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
