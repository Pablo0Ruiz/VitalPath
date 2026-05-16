'use client';

import DataTable from '@/components/ui/molecules/DataTable/DataTable';
import { useCitasAdministrator } from '@repo/api-client';
import { appointmentColumns } from './appointments.constants';

export default function AppointmentsPage() {
  const { data: citas, isLoading } = useCitasAdministrator();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-brand-text-primary">
          Citas
        </h2>
      </div>

      <DataTable
        columns={appointmentColumns}
        data={citas}
        loading={isLoading}
        getRowKey={row => String(row._id)}
      />
    </div>
  );
}
