import {
  Calendar03Icon,
  UserGroupIcon,
  Tick02Icon,
  Medicine02Icon,
  SparklesIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { StatCard } from '@/components/ui/molecules/StatCard';
import { PatientRow } from '@/components/ui/molecules/PatientRow';
import { Card } from '@/components/ui/atoms/Card';
import { ReportHistory } from '@/components/ui/organisms/ReportHistory';
import { useCitasMedico } from '@repo/api-client';

const DashboardDoctor = () => {
  const { data: citas = [], isLoading, isError, error } = useCitasMedico();

  const todayKey = new Date().toISOString().split('T')[0];
  const citasHoy = isLoading
    ? '—'
    : citas.filter(c => c.fecha?.startsWith(todayKey)).length;
  const pacientesUnicos = isLoading
    ? '—'
    : new Set(citas.map(c => c.paciente_ID._id)).size;
  const checkInsRecibidos = isLoading
    ? '—'
    : citas.filter(c => c.estado === 'asistida').length;

  const nextCita = citas.find(
    c => c.estado === 'agendada' && c.fecha >= todayKey,
  );

  if (isError) {
    return (
      <div className="p-4 text-brand-state-error text-sm">
        Error al cargar citas: {error.message}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={Calendar03Icon}
          value={citasHoy}
          label="Citas hoy"
          tone="brand"
        />
        <StatCard
          icon={UserGroupIcon}
          value={pacientesUnicos}
          label="Mis pacientes"
          tone="neutral"
        />
        <StatCard
          icon={Tick02Icon}
          value={checkInsRecibidos}
          label="Check-ins"
          tone="success"
        />
        <StatCard
          icon={Medicine02Icon}
          value="—"
          label="Recetas activas"
          tone="warning"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card elevated className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-text-secondary">
              Próxima cita
            </h3>
            <span className="text-xs text-brand-primary-600 font-medium">
              Hoy
            </span>
          </div>
          {nextCita ? (
            <div className="flex flex-col gap-1">
              <p className="text-base font-semibold text-brand-text-primary">
                {nextCita.paciente_ID.name} {nextCita.paciente_ID.lastName}
              </p>
              <p className="text-sm text-brand-text-secondary">
                {nextCita.hora}
              </p>
              <span className="mt-1 self-start text-xs font-medium px-2 py-0.5 rounded-full bg-brand-primary-50 text-brand-primary-700 dark:bg-brand-primary-600/10 dark:text-brand-primary-400">
                {nextCita.estado}
              </span>
            </div>
          ) : (
            <p className="text-sm text-brand-text-secondary">
              Sin citas pendientes
            </p>
          )}
        </Card>
        <Card glass className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-accent-ai/10 flex items-center justify-center">
              <HugeiconsIcon
                icon={SparklesIcon}
                size={16}
                className="text-brand-accent-ai"
              />
            </div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-text-secondary">
              VitalPath AI
            </h3>
          </div>
          <p className="text-sm text-brand-text-secondary leading-relaxed">
            Resumen e insights de tus pacientes aparecerán aquí.
          </p>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <Card className="lg:col-span-3 flex flex-col gap-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-text-secondary">
            Mis pacientes de hoy
          </h3>
          <div className="flex flex-col gap-2">
            {citas.map(p => (
              <div
                key={p._id}
                className="flex items-center gap-3 px-3 py-2.5 bg-brand-background rounded-xl border border-brand-border hover:border-brand-primary-200 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <PatientRow
                    name={p.paciente_ID.name}
                    lastName={p.paciente_ID.lastName}
                    estado={p.estado}
                  />
                </div>
                <span className="text-xs font-medium text-brand-text-secondary shrink-0 tabular-nums">
                  {p.estado === 'asistida' ? `✓ ${p.hora}` : p.hora}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-1 flex flex-col gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-text-secondary">
            Acciones rápidas
          </h3>
          <div className="flex flex-col gap-2">
            <div className="h-9 rounded-lg bg-brand-background border border-brand-border" />
            <div className="h-9 rounded-lg bg-brand-background border border-brand-border" />
            <div className="h-9 rounded-lg bg-brand-background border border-brand-border" />
          </div>
        </Card>
      </div>
      <ReportHistory />
    </div>
  );
};

export default DashboardDoctor;
