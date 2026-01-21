import { Redirect } from 'expo-router';

export default function Index() {
  // Redirige automáticamente al onboarding
  return <Redirect href="/onboarding" />;
}
