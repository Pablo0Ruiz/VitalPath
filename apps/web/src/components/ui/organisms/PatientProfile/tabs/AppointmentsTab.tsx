'use client';

import { useCitasMedico } from '@repo/api-client';

interface AppointmentsTabProps {
  patientId: string;
}

const AppointmentsTab = ({ patientId }: AppointmentsTabProps) => {
  const { data: citas, isLoading, isError } = useCitasMedico();

  if (isLoading) {
    return (
      <p className="text-sm text-brand-text-secondary py-6 text-center">
        Cargando citas...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-brand-state-error-dark py-6 text-center">
        Error al cargar citas.
      </p>
    );
  }

  const filtered = (citas ?? []).filter(
    cita =>
      cita.paciente_ID &&
      typeof cita.paciente_ID !== 'string' &&
      cita.paciente_ID._id === patientId,
  );

  if (filtered.length === 0) {
    return (
      <p className="text-sm text-brand-text-secondary py-6 text-center">
        Este paciente no tiene citas registradas.
      </p>
    );
  }

  return (
    <div className="divide-y divide-brand-border">
      {filtered.map(cita => (
        <div key={cita._id} className="py-3 flex items-center gap-4">
          <div className="flex flex-col gap-0.5 flex-1">
            <span className="text-sm font-medium text-brand-text-primary">
              {cita.fecha} · {cita.hora}
            </span>
            <span className="text-xs text-brand-text-secondary capitalize">
              {cita.estado}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppointmentsTab;
