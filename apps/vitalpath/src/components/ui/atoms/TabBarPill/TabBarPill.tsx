import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '@/src/hooks/useTheme';

const ICON_MAP: Record<string, keyof typeof Feather.glyphMap> = {
  home: 'home',
  'home/index': 'home',
  chat: 'message-circle',
  'chat/index': 'message-circle',
  records: 'file-text',
  appointments: 'calendar',
  'appointments/index': 'calendar',
};

type TabBarOptionsWithItem = { tabBarItemStyle?: { display?: string } };

export type TabBarPillProps = BottomTabBarProps;

const TabBarPill = ({ state, descriptors, navigation }: TabBarPillProps) => {
  const insets = useSafeAreaInsets();
  const t = useTheme();
  const currentRouteName = state.routes[state.index]?.name;

  if (currentRouteName?.includes('chat')) {
    return null;
  }

  const visibleRoutes = state.routes.filter(route => {
    const { options } = descriptors[route.key];
    return (
      (options as TabBarOptionsWithItem).tabBarItemStyle?.display !== 'none'
    );
  });

  return (
    <View
      style={[
        s.container,
        {
          backgroundColor: t.primary900,
          marginBottom: Math.max(insets.bottom, 12),
        },
      ]}
    >
      {visibleRoutes.map(route => {
        const { options } = descriptors[route.key];
        const routeIndex = state.routes.findIndex(r => r.key === route.key);
        const focused = state.index === routeIndex;

        const iconColor = focused ? t.white : t.neutral400;

        const iconName =
          ICON_MAP[route.name] ??
          (options.tabBarIcon
            ? undefined
            : ('circle' as keyof typeof Feather.glyphMap));

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params as object);
          }
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={focused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            style={({ pressed }) => [s.item, { opacity: pressed ? 0.8 : 1 }]}
          >
            {options.tabBarIcon ? (
              options.tabBarIcon({ focused, color: iconColor, size: 22 })
            ) : iconName ? (
              <Feather name={iconName} size={24} color={iconColor} />
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 9999,
    height: 64,
    paddingHorizontal: 8,
    marginHorizontal: 20,
    elevation: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
  },
});

export default TabBarPill;
