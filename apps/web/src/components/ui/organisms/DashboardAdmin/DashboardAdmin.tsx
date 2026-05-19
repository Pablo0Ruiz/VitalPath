'use client';

import { useState, useMemo } from 'react';
import {
  UserGroupIcon,
  Calendar03Icon,
  Stethoscope02Icon,
  Tick02Icon,
  Search01Icon,
} from '@hugeicons/core-free-icons';
import { StatCard } from '@/components/ui/molecules/StatCard';
import { Input } from '@/components/ui/atoms/Input';
import { CheckInTable } from '@/components/ui/organisms/CheckInTable';
import { AlertPanel } from '@/components/ui/organisms/AlertPanel';
import {
  computeDashboardAlerts,
  OVERLOAD_THRESHOLD,
  formatLocalYMD,
} from '@/components/ui/organisms/AlertPanel/computeDashboardAlerts';
import { useStatsSummary, useCitasAdministrator } from '@repo/api-client';

const DashboardAdmin = () => {
  const [search, setSearch] = useState('');

  const {
    data: stats,
    isLoading: isLoadingStats,
    isError: isErrorStats,
  } = useStatsSummary();
  const {
    data: citas,
    isLoading: isLoadingCitas,
    isError: isErrorCitas,
  } = useCitasAdministrator();

  const today = useMemo(() => formatLocalYMD(new Date()), []);

  const todayCitas = useMemo(
    () => (citas ?? []).filter(c => c.fecha === today),
    [citas, today],
  );

  const statValues = useMemo(
    () => ({
      pacientesEsperandoHoy: todayCitas.filter(
        c => c.estado === 'agendada' || c.estado === 'asistida',
      ).length,
      turnosDelDia: todayCitas.length,
      medicosActivosHoy: new Set(
        todayCitas
          .map(c => c.medico_ID?._id)
          .filter((id): id is string => Boolean(id)),
      ).size,
      resultadosListosPendientes:
        stats?.appointmentsByState?.['resultados_listos'] ?? 0,
    }),
    [todayCitas, stats],
  );

  const alerts = useMemo(
    () => computeDashboardAlerts(citas ?? [], new Date(), OVERLOAD_THRESHOLD),
    [citas],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={UserGroupIcon}
          value={
            isLoadingCitas || isErrorCitas
              ? '—'
              : statValues.pacientesEsperandoHoy
          }
          label="Pacientes esperando hoy"
          tone="brand"
        />
        <StatCard
          icon={Calendar03Icon}
          value={isLoadingCitas || isErrorCitas ? '—' : statValues.turnosDelDia}
          label="Turnos del día"
          tone="neutral"
        />
        <StatCard
          icon={Stethoscope02Icon}
          value={
            isLoadingCitas || isErrorCitas ? '—' : statValues.medicosActivosHoy
          }
          label="Médicos activos hoy"
          tone="success"
        />
        <StatCard
          icon={Tick02Icon}
          value={
            isLoadingStats || isErrorStats
              ? '—'
              : statValues.resultadosListosPendientes
          }
          label="Resultados listos"
          tone="warning"
        />
      </div>

      <AlertPanel
        alerts={alerts}
        isLoading={isLoadingCitas}
        isError={isErrorCitas}
      />

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Buscar paciente..."
              leftIcon={Search01Icon}
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
            />
          </div>
        </div>
        <CheckInTable />
      </div>
    </div>
  );
};

export default DashboardAdmin;
