import { StyleSheet, View } from 'react-native';
import TimelineIcon, {
  type TimelineStatus,
} from '../../atoms/TimeLineIcon/TimeLineIcon';
import TimelineCard, {
  type TimelineCardProps,
} from '../TimeLineCard/TimeLineCard';
import { useTheme } from '@/src/hooks/useTheme';

export interface TimelineStepProps extends TimelineCardProps {
  isLast?: boolean;
}

const TimelineStep = ({
  isLast = false,
  status,
  ...props
}: TimelineStepProps) => {
  const t = useTheme();

  return (
    <View style={s.container}>
      <View style={s.indicatorWrapper}>
        <TimelineIcon status={status as TimelineStatus} />
        {!isLast && (
          <View style={[s.line, { backgroundColor: t.primary200 }]} />
        )}
      </View>

      <View style={s.content}>
        <TimelineCard status={status} {...props} />
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: { flexDirection: 'row' },
  indicatorWrapper: { alignItems: 'center', marginRight: 12, width: 40 },
  line: { flex: 1, width: 2, marginTop: 4, minHeight: 24 },
  content: { flex: 1, marginBottom: 16 },
});

export default TimelineStep;
