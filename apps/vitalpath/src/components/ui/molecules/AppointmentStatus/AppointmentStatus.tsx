import { StyleSheet, View, ViewProps } from 'react-native';
import { Button, TextField } from '../../atoms';
import { getEstadoConfig } from '@/src/constants/appointments';
import { CitaEstado } from '@repo/types';
import { useTheme } from '@/src/hooks/useTheme';

export interface AppointmentStatusProps extends ViewProps {
  status: CitaEstado;
  onCancel?: () => void;
  isCancelling?: boolean;
}

const AppointmentStatus = ({
  status,
  onCancel,
  isCancelling,
  style,
  ...props
}: AppointmentStatusProps) => {
  const t = useTheme();
  const config = getEstadoConfig(t)[status] ?? getEstadoConfig(t).agendada;
  const isCancelada = status === 'cancelada';

  return (
    <View style={[s.container, style]} {...props}>
      <View style={[s.badge, { backgroundColor: config.bg }]}>
        <TextField variant="body" style={[s.badgeText, { color: config.text }]}>
          {config.label}
        </TextField>
      </View>
      {!isCancelada && onCancel && (
        <Button
          onPress={onCancel}
          disabled={isCancelling}
          style={[s.cancelButton, { backgroundColor: t.errorLight }]}
        >
          <TextField variant="body" style={[s.cancelText, { color: t.error }]}>
            Cancelar
          </TextField>
        </Button>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  container: { alignItems: 'flex-end' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 9999 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  cancelButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
    marginTop: 8,
  },
  cancelText: { fontSize: 12, fontWeight: '500' },
});

export default AppointmentStatus;
