'use client';

import { useMedicationsByPatient } from '@repo/api-client';

interface MedicationsTabProps {
  patientId: string;
}

const MedicationsTab = ({ patientId }: MedicationsTabProps) => {
  const {
    data: medications,
    isLoading,
    isError,
  } = useMedicationsByPatient(patientId);

  if (isLoading) {
    return (
      <p className="text-sm text-brand-text-secondary py-6 text-center">
        Cargando medicamentos...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-brand-state-error-dark py-6 text-center">
        Error al cargar medicamentos.
      </p>
    );
  }

  if (!medications || medications.length === 0) {
    return (
      <p className="text-sm text-brand-text-secondary py-6 text-center">
        Sin medicamentos activos.
      </p>
    );
  }

  return (
    <div className="divide-y divide-brand-border">
      {medications.map(med => (
        <div key={med._id} className="py-3 flex flex-col gap-0.5">
          <span className="text-sm font-medium text-brand-text-primary">
            {med.name}
          </span>
          {med.description && (
            <span className="text-xs text-brand-text-secondary">
              {med.description}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default MedicationsTab;
