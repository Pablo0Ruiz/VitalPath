import { StyleSheet, View, ViewProps } from 'react-native';
import { TextField } from '../TextField';
import {
  tabsContainerStyle,
  tabsTextStyle,
  type TabsVariant,
} from './Tabs.variants';
import { useTheme } from '@/src/hooks/useTheme';

export interface TabsProps extends ViewProps {
  label: string;
  variant?: TabsVariant;
}

const Tabs = ({ label, variant = 'date', style, ...props }: TabsProps) => {
  const t = useTheme();

  return (
    <View style={[s.base, tabsContainerStyle(variant, t), style]} {...props}>
      <TextField variant="caption" style={[s.text, tabsTextStyle(variant, t)]}>
        {label}
      </TextField>
    </View>
  );
};

const s = StyleSheet.create({
  base: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  text: { fontWeight: '700' },
});

Tabs.displayName = 'Tabs';
export default Tabs;
