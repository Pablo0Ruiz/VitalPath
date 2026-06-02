import { StyleSheet, TouchableOpacity, View, ViewProps } from 'react-native';
import { Card } from '@/src/components/ui/atoms/Card';
import { TextField } from '@/src/components/ui/atoms';
import { AppointmentRow } from '../AppointmentRow';
import { AppointmentStatus } from '../AppointmentStatus';
import { formatRelativeDay } from '@/src/utils/date';
import { toTitleCase } from '@/src/utils/text';
import { CitaPopulated } from '@repo/types';
import { useTheme } from '@/src/hooks/useTheme';

export interface AppointmentCardProps extends ViewProps {
  appointment: CitaPopulated;
  onCancel?: (id: string) => void;
  isCancelling?: boolean;
  isOverdue?: boolean;
  onReschedule?: () => void;
}

const AppointmentCard = ({
  appointment,
  onCancel,
  isCancelling,
  isOverdue,
  onReschedule,
  style,
  ...props
}: AppointmentCardProps) => {
  const t = useTheme();
  const { name, lastName } = appointment.medico_ID;
  const avatarInitials = `${name[0]}${lastName[0]}`.toUpperCase();
  const doctorDisplayName = `${toTitleCase(name)} ${toTitleCase(lastName)}`;

  return (
    <Card
      variant="elevated"
      padding="md"
      style={[
        s.container,
        isOverdue && { borderColor: t.error, borderWidth: 1 },
        style,
      ]}
      {...props}
    >
      <View style={s.row}>
        <AppointmentRow
          doctor={doctorDisplayName}
          specialty={appointment.medico_ID.especialidad}
          time={appointment.hora}
          date={formatRelativeDay(appointment.fecha)}
          avatarInitials={avatarInitials}
        />
      </View>
      <View style={s.status}>
        {isOverdue ? (
          <TouchableOpacity
            testID="reschedule-button"
            onPress={onReschedule}
            style={[s.rescheduleButton, { backgroundColor: t.errorLight }]}
          >
            <TextField
              variant="body"
              style={[s.rescheduleText, { color: t.error }]}
            >
              Reagendar
            </TextField>
          </TouchableOpacity>
        ) : (
          <AppointmentStatus
            status={appointment.estado}
            onCancel={onCancel ? () => onCancel(appointment._id) : undefined}
            isCancelling={isCancelling}
          />
        )}
      </View>
    </Card>
  );
};

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  row: { flex: 1 },
  status: { marginLeft: 8, marginTop: 4 },
  rescheduleButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  rescheduleText: { fontSize: 12, fontWeight: '500' },
});

export default AppointmentCard;
