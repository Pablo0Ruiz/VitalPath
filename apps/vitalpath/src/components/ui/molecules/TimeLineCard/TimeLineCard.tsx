import {
  ImageSourcePropType,
  Text,
  View,
  ViewProps,
  StyleSheet,
} from 'react-native';
import {
  TextField,
  Tabs,
  ProgressBar,
  Avatar,
} from '@/src/components/ui/atoms';
import { useTheme } from '@/src/hooks/useTheme';

export type CardStatus = 'completed' | 'sample' | 'processing' | 'locked';

export interface TimelineCardProps extends ViewProps {
  status: CardStatus;
  title: string;
  time?: string;
  date?: string;
  doctorName?: string;
  doctorImage?: ImageSourcePropType;
  samples?: string;
  progressLabel?: string;
  progressValue?: number;
  pendingNote?: string;
  estimatedTime?: string;
  isActive?: boolean;
  isLocked?: boolean;
}

const TimelineCard = ({
  status,
  title,
  time,
  date,
  doctorName,
  doctorImage,
  samples,
  progressLabel,
  progressValue,
  pendingNote,
  estimatedTime,
  isLocked,
  style,
  ...props
}: TimelineCardProps) => {
  const t = useTheme();

  return (
    <View
      style={[
        s.container,
        {
          backgroundColor: t.surfaceElevated,
          borderColor: isLocked ? t.border : t.neutral100,
          opacity: isLocked ? 0.7 : 1,
        },
        !isLocked && s.shadow,
        style,
      ]}
      {...props}
    >
      <View style={s.header}>
        <TextField
          variant="body"
          style={[
            s.title,
            { color: status === 'processing' ? t.primary600 : t.textPrimary },
          ]}
        >
          {title}
        </TextField>
        {date && <Tabs label={date} variant={isLocked ? 'pending' : 'date'} />}
      </View>

      {time && (
        <View style={s.row}>
          <TextField variant="caption" style={{ color: t.textSecondary }}>
            🕐 {time}
          </TextField>
        </View>
      )}

      {doctorName && (
        <View style={s.doctorRow}>
          <Avatar image={doctorImage} size="sm" />
          <TextField
            variant="caption"
            style={[s.doctorName, { color: t.textSecondary }]}
          >
            {doctorName}
          </TextField>
        </View>
      )}

      {samples && (
        <View
          style={[
            s.samplesWrapper,
            { backgroundColor: t.primary50, borderColor: t.border },
          ]}
        >
          <TextField variant="caption" style={{ color: t.textSecondary }}>
            Muestras procesadas:{' '}
            <Text style={[s.bold, { color: t.textPrimary }]}>{samples}</Text>
          </TextField>
        </View>
      )}

      {progressLabel !== undefined && progressValue !== undefined && (
        <View style={s.progressSection}>
          <ProgressBar progress={progressValue} style={s.progressBar} />
          <TextField variant="label" style={{ color: t.primary600 }}>
            {progressLabel}{' '}
            <Text style={s.extrabold}>{progressValue}% COMPLETADO</Text>
          </TextField>
        </View>
      )}

      {pendingNote && (
        <TextField
          variant="caption"
          style={[s.note, { color: t.textSecondary }]}
        >
          {pendingNote}
        </TextField>
      )}
      {estimatedTime && (
        <View style={s.estimatedRow}>
          <TextField
            variant="caption"
            style={[s.italic, { color: t.textSecondary }]}
          >
            ℹ Tiempo estimado: {estimatedTime}
          </TextField>
        </View>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  container: { borderRadius: 16, padding: 16, borderWidth: 1 },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    flex: 1,
    marginRight: 8,
    textAlign: 'left',
  },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  doctorName: { fontWeight: '500' },
  samplesWrapper: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 8,
  },
  bold: { fontWeight: '700' },
  progressSection: { marginTop: 12 },
  progressBar: { marginBottom: 8 },
  extrabold: { fontWeight: '800' },
  note: { marginTop: 4, fontSize: 12 },
  estimatedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  italic: { fontStyle: 'italic', fontSize: 12 },
});

export default TimelineCard;
