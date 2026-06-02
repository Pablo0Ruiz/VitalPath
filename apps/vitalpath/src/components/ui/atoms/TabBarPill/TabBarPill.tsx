import { Pressable, StyleSheet, Text, View } from 'react-native';
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
          backgroundColor: t.surfaceElevated,
          borderColor: t.border,
          marginBottom: Math.max(insets.bottom, 12),
        },
      ]}
    >
      {visibleRoutes.map(route => {
        const { options } = descriptors[route.key];
        const routeIndex = state.routes.findIndex(r => r.key === route.key);
        const focused = state.index === routeIndex;

        const iconColor = focused ? t.primary600 : t.neutral400;

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

        const label = descriptors[route.key].options.title ?? route.name;

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={focused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            style={({ pressed }) => [
              s.item,
              focused && { backgroundColor: t.primary50 },
              { opacity: pressed ? 0.8 : 1 },
            ]}
          >
            {options.tabBarIcon ? (
              options.tabBarIcon({ focused, color: iconColor, size: 20 })
            ) : iconName ? (
              <Feather name={iconName} size={20} color={iconColor} />
            ) : null}
            <Text numberOfLines={1} style={[s.label, { color: iconColor }]}>
              {label}
            </Text>
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
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginHorizontal: 20,
    borderWidth: 1,
    elevation: 6,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  item: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 48,
    paddingHorizontal: 8,
    borderRadius: 24,
    gap: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 14,
  },
});

export default TabBarPill;
