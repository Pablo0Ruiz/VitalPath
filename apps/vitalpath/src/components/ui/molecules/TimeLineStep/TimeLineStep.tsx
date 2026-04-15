import { View } from 'react-native';
import TimelineIcon, {
  type TimelineStatus,
} from '../../atoms/TimeLineIcon/TimeLineIcon';
import TimelineCard, {
  type TimelineCardProps,
} from '../TimeLineCard/TimeLineCard';

export interface TimelineStepProps extends TimelineCardProps {
  isLast?: boolean;
}

const TimelineStep = ({
  isLast = false,
  status,
  ...props
}: TimelineStepProps) => {
  return (
    <View className="flex-row">
      <View className="items-center mr-3" style={{ width: 40 }}>
        <TimelineIcon status={status as TimelineStatus} />
        {!isLast && (
          <View
            className="flex-1 w-0.5 bg-blue-200 mt-1"
            style={{ minHeight: 24 }}
          />
        )}
      </View>

      <View className="flex-1 mb-4">
        <TimelineCard status={status} {...props} />
      </View>
    </View>
  );
};

export default TimelineStep;
