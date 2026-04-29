import {
  Calendar03Icon,
  UserGroupIcon,
  Tick02Icon,
  Medicine02Icon,
} from '@hugeicons/core-free-icons';
import { StatCard } from '@/components/ui/molecules/StatCard';
import { PatientRow } from '@/components/ui/molecules/PatientRow';
import { Card } from '@/components/ui/atoms/Card';
import { ReportHistory } from '@/components/ui/organisms/ReportHistory';
import { useCitasMedico } from '@repo/api-client';

const DashboardDoctor = () => {
  const { data: citas, isLoading, isError, error } = useCitasMedico();
  if (isLoading) {
    return <div>Cargando citas...</div>;
  }
  if (isError) {
    return <div>Error al cargar citas: {error.message}</div>;
  }
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={Calendar03Icon}
          value={8}
          label="Citas hoy"
          tone="brand"
        />
        <StatCard
          icon={UserGroupIcon}
          value={24}
          label="Mis pacientes"
          tone="neutral"
        />
        <StatCard
          icon={Tick02Icon}
          value={3}
          label="Check-in recibidos"
          tone="success"
        />
        <StatCard
          icon={Medicine02Icon}
          value={12}
          label="Recetas activas"
          tone="warning"
        />
      </div>

      <div className="flex flex-col gap-6">
        <Card padding="md" className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-brand-text-primary">
            Mis pacientes de hoy
          </h3>
          <div className="flex flex-col gap-3">
            {citas?.map(p => (
              <div
                key={p._id}
                className="flex items-center gap-3 p-3 bg-brand-neutral-50 rounded-xl border border-brand-border"
              >
                <div className="flex-1 min-w-0">
                  <PatientRow
                    name={p.paciente_ID.name}
                    lastName={p.paciente_ID.lastName}
                    estado={p.estado}
                  />
                </div>
                <span className="text-xs text-brand-text-secondary shrink-0">
                  {p.estado === 'asistida' ? `Check-in ${p.hora}` : p.hora}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <ReportHistory />
      </div>
    </div>
  );
};

export default DashboardDoctor;
