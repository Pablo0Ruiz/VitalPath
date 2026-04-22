import { View, ViewProps } from 'react-native';
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
  className,
  ...props
}: AppointmentCardProps) => {
  const { name, lastName } = appointment.medico_ID;
  const avatarInitials = `${name[0]}${lastName[0]}`.toUpperCase();

  return (
    <View
      className={`flex-row items-start justify-between ${className ?? ''}`}
      {...props}
    >
      <View className="flex-1">
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
        className="ml-2 mt-1"
      />
    </View>
  );
};

export default AppointmentCard;
