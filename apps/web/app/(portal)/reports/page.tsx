'use client';

import {
  UserGroupIcon,
  Stethoscope02Icon,
  Tick02Icon,
  Search01Icon,
} from '@hugeicons/core-free-icons';
import { useStatsSummary } from '@repo/api-client';
import { Skeleton } from '@/components/ui/atoms/Skeleton';
import { StatCard } from '@/components/ui/molecules/StatCard';
import { DataTable } from '@/components/ui/molecules/DataTable';
import { EmptyState } from '@/components/ui/molecules/EmptyState';

type AppointmentRow = { estado: string; count: number };

const STATE_COLUMNS = [
  { key: 'estado', label: 'Estado' },
  { key: 'count', label: 'Cantidad' },
];

export default function ReportsPage() {
  const { data, isLoading } = useStatsSummary();

  if (!data && !isLoading) {
    return (
      <EmptyState
        icon={Search01Icon}
        title="Sin datos disponibles"
        description="No se pudieron cargar las estadísticas. Intentá de nuevo más tarde."
      />
    );
  }

  const rows: AppointmentRow[] = data
    ? Object.entries(data.appointmentsByState).map(([estado, count]) => ({
        estado,
        count,
      }))
    : [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-brand-text-primary">Reportes</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            icon={UserGroupIcon}
            value={data?.totalPatients ?? 0}
            label="Pacientes"
            tone="brand"
          />
          <StatCard
            icon={Stethoscope02Icon}
            value={data?.totalDoctors ?? 0}
            label="Médicos"
            tone="success"
          />
          <StatCard
            icon={Tick02Icon}
            value={data?.totalMoods ?? 0}
            label="Check-ins de ánimo"
            tone="warning"
          />
        </div>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-brand-text-primary">
          Citas por estado
        </h2>
        <DataTable
          columns={STATE_COLUMNS}
          data={rows}
          loading={isLoading}
          ariaLabel="Citas por estado"
          getRowKey={row => row.estado}
        />
      </section>
    </div>
  );
}
