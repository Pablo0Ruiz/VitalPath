'use client';

import { useState, useMemo } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  UserGroupIcon,
  Calendar03Icon,
  Stethoscope02Icon,
  Tick02Icon,
  SparklesIcon,
  Search01Icon,
} from '@hugeicons/core-free-icons';
import { StatCard } from '@/components/ui/molecules/StatCard';
import { Input } from '@/components/ui/atoms/Input';
import { Card } from '@/components/ui/atoms/Card';
import { CheckInTable } from '@/components/ui/organisms/CheckInTable';
import { AlertPanel } from '@/components/ui/organisms/AlertPanel';
import {
  computeDashboardAlerts,
  OVERLOAD_THRESHOLD,
} from '@/components/ui/organisms/AlertPanel/computeDashboardAlerts';
import { useStatsSummary, useCitasAdministrator } from '@repo/api-client';
import { formatLocalYMD } from '../../../../utils/format';

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

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Buenos días';
    if (h < 19) return 'Buenas tardes';
    return 'Buenas noches';
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-brand-text-primary tracking-tight">
          {greeting}
        </h2>
        <p className="text-sm text-brand-text-secondary mt-0.5">
          {new Date().toLocaleDateString('es-AR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={UserGroupIcon}
          value={
            isLoadingCitas || isErrorCitas
              ? '—'
              : statValues.pacientesEsperandoHoy
          }
          label="Esperando hoy"
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
          label="Médicos activos"
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
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AlertPanel
            alerts={alerts}
            isLoading={isLoadingCitas}
            isError={isErrorCitas}
          />
        </div>
        <Card glass className="flex flex-col gap-3 lg:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-accent-ai/10 flex items-center justify-center">
              <HugeiconsIcon
                icon={SparklesIcon}
                size={15}
                className="text-brand-accent-ai"
              />
            </div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-text-secondary">
              VitalPath AI
            </h3>
          </div>
          <p className="text-sm text-brand-text-secondary leading-relaxed">
            Insights y resúmenes automáticos de la operación del día aparecerán
            aquí.
          </p>
          {!isLoadingCitas && todayCitas.length > 0 && (
            <div className="mt-auto pt-3 border-t border-brand-border">
              <p className="text-xs text-brand-text-secondary">
                <span className="font-semibold text-brand-primary-600">
                  {todayCitas.length}
                </span>{' '}
                turnos programados hoy
              </p>
            </div>
          )}
        </Card>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 max-w-xs">
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
