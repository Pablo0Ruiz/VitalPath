'use client';

import { useMemo } from 'react';
import DataTable from '@/components/ui/molecules/DataTable/DataTable';
import { useCitasMedico } from '@repo/api-client';
import { formatLocalYMD } from '@/utils/format';
import { buildReadOnlyAppointmentColumns } from './appointments.constants';

const columns = buildReadOnlyAppointmentColumns();

export default function MedicoAppointmentsView() {
  const { data: citas, isLoading } = useCitasMedico();

  const today = formatLocalYMD(new Date());

  const upcomingCitas = useMemo(
    () => (citas ?? []).filter(c => c.fecha >= today),
    [citas, today],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-brand-text-primary tracking-tight">
          Mis citas
        </h2>
        <p className="text-sm text-brand-text-secondary mt-0.5">
          Agenda y pacientes del día
        </p>
      </div>

      {!isLoading && upcomingCitas.length === 0 && (
        <p className="text-sm text-brand-text-secondary text-center py-8">
          No hay citas próximas.
        </p>
      )}

      <DataTable
        columns={columns}
        data={upcomingCitas}
        loading={isLoading}
        getRowKey={r => String(r._id)}
      />
    </div>
  );
}
