import { StyleSheet, View, ViewProps } from 'react-native';
import { Card } from '@/src/components/ui/atoms/Card';
import { AppointmentRow } from '../AppointmentRow';
import { AppointmentStatus } from '../AppointmentStatus';
import { formatDateShort } from '@/src/utils/date';
import { CitaPopulated } from '@repo/types';

export interface AppointmentCardProps extends ViewProps {
  appointment: CitaPopulated;
  onCancel?: (id: string) => void;
  isCancelling?: boolean;
}

const AppointmentCard = ({
  appointment,
  onCancel,
  isCancelling,
  style,
  ...props
}: AppointmentCardProps) => {
  const { name, lastName } = appointment.medico_ID;
  const avatarInitials = `${name[0]}${lastName[0]}`.toUpperCase();

  return (
    <Card
      variant="elevated"
      padding="md"
      style={[s.container, style]}
      {...props}
    >
      <View style={s.row}>
        <AppointmentRow
          doctor={`${name} ${lastName}`}
          specialty={appointment.medico_ID.especialidad}
          time={appointment.hora}
          date={formatDateShort(appointment.fecha)}
          avatarInitials={avatarInitials}
        />
      </View>
      <AppointmentStatus
        status={appointment.estado}
        onCancel={onCancel ? () => onCancel(appointment._id) : undefined}
        isCancelling={isCancelling}
        style={s.status}
      />
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
});

export default AppointmentCard;
