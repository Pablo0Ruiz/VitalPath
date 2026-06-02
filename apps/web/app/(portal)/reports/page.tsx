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
import { Card } from '@/components/ui/atoms/Card';

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
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h2 className="text-xl font-bold text-brand-text-primary tracking-tight">
            Estadísticas del centro
          </h2>
          <p className="text-sm text-brand-text-secondary mt-0.5">
            Resumen general de actividad
          </p>
        </div>
      </div>

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

      <Card padding="none" className="relative overflow-hidden flex flex-col">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-linear-to-r from-brand-secondary-500 to-brand-primary-500" />
        <div className="px-5 pt-6 pb-4 border-b border-brand-border">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-text-secondary">
            Citas por estado
          </span>
        </div>
        <DataTable
          columns={STATE_COLUMNS}
          data={rows}
          loading={isLoading}
          ariaLabel="Citas por estado"
          getRowKey={row => row.estado}
        />
      </Card>
    </div>
  );
}
