import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TAB_ROUTES } from '@/src/routes/routes';
import { TabBarPill } from '@/src/components/ui/atoms/TabBarPill';
import { useRole } from '@/src/hooks/useRole';

const ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  Home01Icon: 'home-outline',
  BubbleChatIcon: 'chatbubble-outline',
  Calendar03Icon: 'calendar-outline',
  NoteIcon: 'document-text-outline',
};

export default function TabsLayout() {
  const role = useRole();

  return (
    <Tabs
      tabBar={props => <TabBarPill {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      {TAB_ROUTES.map(route => {
        const isAllowed = route.allowedRoles
          ? role !== null && route.allowedRoles.includes(role)
          : true;

        return (
          <Tabs.Screen
            key={route.screenName}
            name={route.screenName}
            options={{
              title: route.title,
              headerShown: false,
              href: isAllowed ? undefined : null,
              tabBarIcon: ({ color, size }) => {
                const iconName = ICON_MAP[route.icon];
                if (!iconName) return null;
                return <Ionicons name={iconName} size={size} color={color} />;
              },
            }}
          />
        );
      })}
      <Tabs.Screen
        name="medications"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
