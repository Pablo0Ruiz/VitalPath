import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { ThemeTokens } from '@/src/constants/tokens';

export type TabsVariant = 'date' | 'active' | 'pending';

export const tabsContainerStyle = (
  variant: TabsVariant,
  t: ThemeTokens,
): ViewStyle => {
  const map: Record<TabsVariant, ViewStyle> = {
    date: { backgroundColor: t.info },
    active: { backgroundColor: t.info },
    pending: { backgroundColor: t.border },
  };
  return map[variant];
};

export const tabsTextStyle = (
  variant: TabsVariant,
  t: ThemeTokens,
): TextStyle => {
  const map: Record<TabsVariant, TextStyle> = {
    date: { color: '#FFFFFF' },
    active: { color: '#FFFFFF' },
    pending: { color: t.textSecondary },
  };
  return map[variant];
};
