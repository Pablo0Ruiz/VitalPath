'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { Loading } from '@hugeicons/core-free-icons';

import { Badge } from '@/components/ui/atoms/Badge';
import { Button } from '@/components/ui/atoms/Button';
import { Card } from '@/components/ui/atoms/Card';

import { CitaEstadoEnum } from '@repo/types';
import { useCitasAdministrator, useUpdateCita } from '@repo/api-client';

const CheckInTable = () => {
  const { data: citas, isLoading } = useCitasAdministrator();
  const { mutateAsync: checkInCita } = useUpdateCita();
  if (!isLoading && !citas) {
    return (
      <HugeiconsIcon
        icon={Loading}
        className="size-10 animate-spin text-brand-primary"
      />
    );
  }

  function handleCheckIn(id: string) {
    checkInCita({ id, payload: { estado: CitaEstadoEnum.ASISTIDA } });
  }

  const rows = citas || [];
  return (
    <Card padding="none" className="flex flex-col gap-0 overflow-hidden">
      <div className="px-5 py-4 border-b border-brand-border">
        <h3 className="text-sm font-semibold text-brand-text-primary">
          Agenda del día
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-brand-neutral-50 border-b border-brand-border">
              {['Hora', 'Paciente', 'Médico', 'Estado', 'Acción'].map(h => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold text-brand-text-secondary uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr
                key={row._id}
                className="border-b border-brand-border last:border-0 hover:bg-brand-neutral-50 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-brand-text-primary">
                  {row.hora}
                </td>
                <td className="px-4 py-3 text-brand-text-primary">
                  {row.paciente_ID.name} {row.paciente_ID.lastName}
                </td>
                <td className="px-4 py-3 text-brand-text-secondary">
                  {row.medico_ID.name} {row.medico_ID.lastName}
                </td>
                <td className="px-4 py-3 text-brand-text-secondary">
                  {row.medico_ID.especialidad}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant={
                      row.estado === CitaEstadoEnum.ASISTIDA
                        ? 'success'
                        : 'warning'
                    }
                    size="sm"
                  >
                    {row.estado === CitaEstadoEnum.ASISTIDA
                      ? 'Asistido'
                      : 'Agendada'}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  {row.estado !== CitaEstadoEnum.ASISTIDA ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleCheckIn(row._id)}
                    >
                      Check-in
                    </Button>
                  ) : (
                    <Badge variant="success" size="sm">
                      Asistido
                    </Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default CheckInTable;
