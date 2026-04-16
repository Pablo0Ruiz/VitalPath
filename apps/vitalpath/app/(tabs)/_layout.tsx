import { Tabs } from 'expo-router';

import { TAB_ROUTES } from '@/src/routes/routes';
import { Octicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#7c3aed',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e2e8f0',
          height: 64,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
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
