'use client';

import { useResultadosByPatient } from '@repo/api-client';

interface NotesTabProps {
  patientId: string;
}

const NotesTab = ({ patientId }: NotesTabProps) => {
  const {
    data: resultados,
    isLoading,
    isError,
  } = useResultadosByPatient(patientId);

  if (isLoading) {
    return (
      <p className="text-sm text-brand-text-secondary py-6 text-center">
        Cargando notas...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-brand-state-error-dark py-6 text-center">
        Error al cargar notas.
      </p>
    );
  }

  const filtered = (resultados ?? []).filter(r => r.notasMedico?.trim());

  if (filtered.length === 0) {
    return (
      <p className="text-sm text-brand-text-secondary py-6 text-center">
        Aún no hay notas del médico.
      </p>
    );
  }

  return (
    <div className="divide-y divide-brand-border">
      {filtered.map(result => (
        <div key={result._id} className="py-4 flex flex-col gap-1">
          <span className="text-xs text-brand-text-secondary">
            {result.createdAt
              ? new Date(result.createdAt).toLocaleDateString('es-AR')
              : ''}
            {result.medico_ID
              ? ` · Dr/a. ${result.medico_ID.name} ${result.medico_ID.lastName}`
              : ''}
          </span>
          <p className="text-sm text-brand-text-primary whitespace-pre-wrap">
            {result.notasMedico}
          </p>
        </div>
      ))}
    </div>
  );
};

export default NotesTab;
