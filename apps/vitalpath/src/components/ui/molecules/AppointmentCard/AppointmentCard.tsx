import { View, ViewProps } from 'react-native';
import { AppointmentRow } from '../AppointmentRow';
import { AppointmentStatus } from '../AppointmentStatus';
import { formatDate } from '@/src/utils/date';
import { Cita } from '@repo/types';

export interface AppointmentCardProps extends ViewProps {
  appointment: Cita;
  onCancel?: (id: string) => void;
  isCancelling?: boolean;
}

const AppointmentCard = ({
  appointment,
  onCancel,
  isCancelling,
  className,
  ...props
}: AppointmentCardProps) => {
  const timeString = appointment.hora;
  const dateString = formatDate(appointment.fecha);

  return (
    <View
      className={`flex-row items-start justify-between ${className ?? ''}`}
      {...props}
    >
      <View className="flex-1">
        <AppointmentRow
          doctor="Dr(a). Asignado"
          specialty="Pendiente"
          time={timeString}
          date={dateString}
          avatarInitials="PR"
        />
      </View>
      <AppointmentStatus
        status={appointment.estado}
        onCancel={onCancel ? () => onCancel(appointment._id) : undefined}
        isCancelling={isCancelling}
        className="ml-2 mt-1"
      />
    </View>
  );
};

export default AppointmentCard;
