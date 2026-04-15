import { View, ViewProps } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { iconConfig } from '@/src/constants/iconConfig';

export type TimelineStatus = 'completed' | 'sample' | 'processing' | 'locked';

export interface TimelineIconProps extends ViewProps {
  status: TimelineStatus;
}

const TimelineIcon = ({ status, className, ...props }: TimelineIconProps) => {
  const { icon, bg, iconColor } = iconConfig[status];
  return (
    <View
      className={`w-10 h-10 rounded-full items-center justify-center ${bg} ${className ?? ''}`}
      {...props}
    >
      <Feather name={icon as any} size={18} color={iconColor} />
    </View>
  );
};

export default TimelineIcon;
