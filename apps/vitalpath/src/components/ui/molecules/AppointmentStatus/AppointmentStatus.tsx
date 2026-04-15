import { View, ViewProps } from 'react-native';
import { Button, TextField } from '../../atoms';
import { ESTADO_CONFIG } from '@/src/constants/appointments';
import { CitaEstado } from '@/src/interfaces/appointments/appointments.interface';

export interface AppointmentStatusProps extends ViewProps {
  status: CitaEstado;
  onCancel?: () => void;
  isCancelling?: boolean;
}

const AppointmentStatus = ({
  status,
  onCancel,
  isCancelling,
  className,
  ...props
}: AppointmentStatusProps) => {
  const config = ESTADO_CONFIG[status] ?? ESTADO_CONFIG.agendada;
  const isCancelada = status === 'cancelada';

  return (
    <View className={`items-end gap-2 ${className ?? ''}`} {...props}>
      <View className={`px-2 py-1 rounded-full ${config.bg}`}>
        <TextField
          variants="body"
          className={`text-xs font-semibold ${config.text}`}
        >
          {config.label}
        </TextField>
      </View>
      {!isCancelada && onCancel && (
        <Button
          onPress={onCancel}
          disabled={isCancelling}
          className="px-2 py-1 rounded-full bg-red-50"
        >
          <TextField
            variants="body"
            className="text-xs text-red-500 font-medium"
          >
            Cancelar
          </TextField>
        </Button>
      )}
    </View>
  );
};

export default AppointmentStatus;
