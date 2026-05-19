'use client';

import { useResultadosByPatient } from '@repo/api-client';

interface StudiesTabProps {
  patientId: string;
}

const StudiesTab = ({ patientId }: StudiesTabProps) => {
  const {
    data: resultados,
    isLoading,
    isError,
  } = useResultadosByPatient(patientId);

  if (isLoading) {
    return (
      <p className="text-sm text-brand-text-secondary py-6 text-center">
        Cargando estudios...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-brand-state-error-dark py-6 text-center">
        Error al cargar estudios.
      </p>
    );
  }

  if (!resultados || resultados.length === 0) {
    return (
      <p className="text-sm text-brand-text-secondary py-6 text-center">
        Sin estudios cargados.
      </p>
    );
  }

  return (
    <div className="divide-y divide-brand-border">
      {resultados.map(result => (
        <div key={result._id} className="py-3 flex items-center gap-4">
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <span className="text-sm font-medium text-brand-text-primary truncate">
              {result.fileUrl}
            </span>
            <span className="text-xs text-brand-text-secondary">
              {result.createdAt
                ? new Date(result.createdAt).toLocaleDateString('es-AR')
                : ''}
            </span>
          </div>
          {result.fileUrl && (
            <a
              href={result.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-brand-primary-600 hover:underline shrink-0"
            >
              Ver
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

export default StudiesTab;
