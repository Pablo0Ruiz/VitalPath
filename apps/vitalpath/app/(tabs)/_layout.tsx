import { Tabs } from 'expo-router';

import { TAB_ROUTES } from '@/src/routes/routes';
import { Octicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#6366f1' }}>
      {TAB_ROUTES.map(route => (
        <Tabs.Screen
          key={route.screenName}
          name={route.screenName}
          options={{
            title: route.title,
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Octicons name={route.icon} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
