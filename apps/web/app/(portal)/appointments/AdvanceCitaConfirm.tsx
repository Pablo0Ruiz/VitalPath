'use client';

import { Button } from '@/components/ui/atoms/Button';
import { useAvanzarCitaEstado } from '@repo/api-client';
import { type CitaEstado, type CitaPopulated } from '@repo/types';
import { estadoConfig } from './appointments.constants';

interface AdvanceCitaConfirmProps {
  cita: CitaPopulated;
  nextEstado: CitaEstado;
  onConfirmed: () => void;
  onCancel: () => void;
}

const AdvanceCitaConfirm = ({
  cita,
  nextEstado,
  onConfirmed,
  onCancel,
}: AdvanceCitaConfirmProps) => {
  const { mutate, isPending } = useAvanzarCitaEstado();

  const handleConfirm = () => {
    mutate({ id: cita._id, estado: nextEstado }, { onSuccess: onConfirmed });
  };

  const currentLabel = estadoConfig[cita.estado]?.label ?? cita.estado;
  const nextLabel = estadoConfig[nextEstado]?.label ?? nextEstado;

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-brand-text-secondary">
        Estás por avanzar el estado de la siguiente cita:
      </p>
      <div className="rounded-lg border border-brand-border p-4 flex flex-col gap-2">
        <p className="text-sm font-medium text-brand-text-primary">
          Paciente: {cita.paciente_ID.name} {cita.paciente_ID.lastName}
        </p>
        <p className="text-sm text-brand-text-secondary">
          Estado actual: {currentLabel}
        </p>
        <p className="text-sm text-brand-text-secondary">
          Nuevo estado: {nextLabel}
        </p>
      </div>
      <div className="flex gap-3 justify-end">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Volver
        </Button>
        <Button
          type="button"
          variant="primary"
          loading={isPending}
          onClick={handleConfirm}
        >
          Confirmar
        </Button>
      </div>
    </div>
  );
};

export default AdvanceCitaConfirm;
