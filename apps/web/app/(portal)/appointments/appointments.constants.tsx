import { Badge } from '@/components/ui/atoms/Badge';
import { Button } from '@/components/ui/atoms/Button';
import { type Column } from '@/components/ui/molecules/DataTable/DataTable';
import { CitaEstadoEnum, type CitaPopulated } from '@repo/types';

export const viewTabs = [{ value: 'list', label: 'Lista' }];

export const estadoConfig: Record<
  string,
  {
    label: string;
    variant: 'success' | 'warning' | 'info' | 'error' | 'neutral';
  }
> = {
  [CitaEstadoEnum.AGENDADA]: { label: 'Agendada', variant: 'info' },
  [CitaEstadoEnum.ASISTIDA]: { label: 'Asistida', variant: 'success' },
  [CitaEstadoEnum.EN_PROCESO]: { label: 'En proceso', variant: 'warning' },
  [CitaEstadoEnum.CANCELADA]: { label: 'Cancelada', variant: 'error' },
};

interface AppointmentColumnHandlers {
  onEdit: (c: CitaPopulated) => void;
  onCancel: (c: CitaPopulated) => void;
}

export function buildAppointmentColumns(
  handlers: AppointmentColumnHandlers,
): Column<CitaPopulated>[] {
  return [
    {
      key: 'paciente',
      label: 'Paciente',
      render: (row: CitaPopulated) =>
        `${row.paciente_ID?.name || 'N/A'} ${row.paciente_ID?.lastName || ''}`,
    },
    {
      key: 'medico',
      label: 'Médico',
      render: (row: CitaPopulated) =>
        `${row.medico_ID?.name || 'N/A'} ${row.medico_ID?.lastName || ''}`,
    },
    { key: 'fecha', label: 'Fecha y hora' },
    {
      key: 'estado',
      label: 'Estado',
      render: (row: CitaPopulated) => {
        const config = estadoConfig[row.estado] ?? {
          label: String(row.estado),
          variant: 'neutral' as const,
        };
        return (
          <Badge variant={config.variant} size="sm">
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (row: CitaPopulated) => (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handlers.onEdit(row)}
          >
            Editar
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => handlers.onCancel(row)}
          >
            Cancelar
          </Button>
        </div>
      ),
    },
  ];
}
