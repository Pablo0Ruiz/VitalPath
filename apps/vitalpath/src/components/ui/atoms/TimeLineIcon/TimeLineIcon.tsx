import { StyleSheet, View, ViewProps } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getIconConfig } from '@/src/constants/iconConfig';
import { useTheme } from '@/src/hooks/useTheme';

export type TimelineStatus = 'completed' | 'sample' | 'processing' | 'locked';

export interface TimelineIconProps extends ViewProps {
  status: TimelineStatus;
}

const TimelineIcon = ({ status, style, ...props }: TimelineIconProps) => {
  const t = useTheme();
  const config = getIconConfig(t)[status];

  return (
    <View
      style={[
        s.base,
        { backgroundColor: config.bg },
        config.borderColor
          ? { borderWidth: 1, borderColor: config.borderColor }
          : undefined,
        style,
      ]}
      {...props}
    >
      <Feather
        name={config.icon as keyof typeof Feather.glyphMap}
        size={18}
        color={config.iconColor}
      />
    </View>
  );
};

const s = StyleSheet.create({
  base: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TimelineIcon;
