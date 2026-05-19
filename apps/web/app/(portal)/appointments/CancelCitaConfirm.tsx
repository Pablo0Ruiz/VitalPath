'use client';

import { Button } from '@/components/ui/atoms/Button';
import { useDeleteCitaByWorker } from '@repo/api-client';
import type { CitaPopulated } from '@repo/types';

interface CancelCitaConfirmProps {
  cita: CitaPopulated;
  onConfirmed: () => void;
  onCancel: () => void;
}

const CancelCitaConfirm = ({
  cita,
  onConfirmed,
  onCancel,
}: CancelCitaConfirmProps) => {
  const { mutate, isPending } = useDeleteCitaByWorker();

  const handleConfirm = () => {
    mutate(cita._id, { onSuccess: onConfirmed });
  };

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-brand-text-secondary">
        Estás por cancelar la siguiente cita:
      </p>
      <div className="rounded-lg border border-brand-border p-4 flex flex-col gap-2">
        <p className="text-sm font-medium text-brand-text-primary">
          Paciente: {cita.paciente_ID.name} {cita.paciente_ID.lastName}
        </p>
        <p className="text-sm text-brand-text-secondary">Fecha: {cita.fecha}</p>
        <p className="text-sm text-brand-text-secondary">Hora: {cita.hora}</p>
      </div>
      <p className="text-sm text-brand-state-error">
        Esta acción no se puede deshacer.
      </p>
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
          Confirmar cancelación
        </Button>
      </div>
    </div>
  );
};

export default CancelCitaConfirm;
