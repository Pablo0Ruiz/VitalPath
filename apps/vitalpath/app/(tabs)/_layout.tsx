import { TAB_ROUTES } from '@/src/routes/routes';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#6366f1' }}>
      {TAB_ROUTES.map(route => (
        <Tabs.Screen
          key={route.screenName}
          name={route.screenName}
          options={{
            title: route.title,
          }}
        />
      ))}
    </Tabs>
  );
}
