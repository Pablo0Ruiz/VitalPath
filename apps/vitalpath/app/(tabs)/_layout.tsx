import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TAB_ROUTES } from '@/src/routes/routes';

const ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  Home01Icon: 'home-outline',
  BubbleChatIcon: 'chatbubble-outline',
  Calendar03Icon: 'calendar-outline',
  NoteIcon: 'document-text-outline',
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#5B4CF5',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          height: 72,
          paddingBottom: 16,
          paddingTop: 8,
          marginHorizontal: 16,
          marginBottom: Platform.OS === 'ios' ? 24 : 16,
          borderRadius: 24,
          elevation: 12,
          shadowColor: '#5B4CF5',
          shadowOpacity: 0.12,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: -4 },
          position: 'absolute',
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 2,
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
            tabBarIcon: ({ color, size }) => {
              const iconName = ICON_MAP[route.icon];
              if (!iconName) return null;
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          }}
        />
      ))}
    </Tabs>
  );
}
