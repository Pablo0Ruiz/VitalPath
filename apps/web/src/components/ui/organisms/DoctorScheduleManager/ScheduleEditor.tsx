'use client';

import { useState } from 'react';
import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@/components/ui/atoms/Button';
import { Input } from '@/components/ui/atoms/Input';
import { usePatchDoctorSchedule } from '@repo/api-client';

interface ScheduleEditorProps {
  doctorUserId: string;
  doctorName: string;
  especialidad: string;
  initialSlots: string[];
  onSaved: () => void;
}

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

const ScheduleEditor = ({
  doctorUserId,
  doctorName,
  especialidad,
  initialSlots,
  onSaved,
}: ScheduleEditorProps) => {
  const [slots, setSlots] = useState<string[]>(initialSlots);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { mutate: patchSchedule, isPending } = usePatchDoctorSchedule();

  const handleAddSlot = () => {
    const trimmed = inputValue.trim();
    if (!TIME_REGEX.test(trimmed)) {
      setInputError('Formato inválido. Usá HH:MM (ej. 09:00)');
      return;
    }
    if (slots.includes(trimmed)) {
      setInputError('Este horario ya existe');
      return;
    }
    setInputError(null);
    setSlots(prev => [...prev, trimmed].sort());
    setInputValue('');
  };

  const handleRemoveSlot = (slot: string) => {
    setSlots(prev => prev.filter(s => s !== slot));
  };

  const handleSave = () => {
    setSuccessMessage(null);
    patchSchedule(
      { doctorUserId, slots },
      {
        onSuccess: () => {
          setSuccessMessage('Horarios guardados con éxito.');
          onSaved();
        },
        onError: () => {
          setSuccessMessage(null);
        },
      },
    );
  };

  const handleDiscard = () => {
    setSlots(initialSlots);
    setInputValue('');
    setInputError(null);
    setSuccessMessage(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSlot();
    }
  };

  return (
    <div className="flex flex-col gap-5 h-full">
      <div>
        <h3 className="text-base font-semibold text-brand-text-primary">
          {doctorName}
        </h3>
        <p className="text-sm text-brand-text-secondary">{especialidad}</p>
      </div>

      <div>
        <p className="text-sm font-medium text-brand-text-primary mb-3">
          Horarios disponibles
        </p>
        {slots.length === 0 ? (
          <p className="text-sm text-brand-text-secondary">
            Sin horarios asignados.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {slots.map(slot => (
              <span
                key={slot}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-primary-100 text-brand-primary-700 text-xs font-medium"
              >
                {slot}
                <button
                  type="button"
                  onClick={() => handleRemoveSlot(slot)}
                  className="ml-0.5 text-brand-primary-700 hover:text-brand-primary-900 transition-colors"
                  aria-label={`Eliminar horario ${slot}`}
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-brand-text-primary">
          Agregar horario
        </p>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="HH:MM (ej. 09:00)"
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setInputValue(e.target.value);
                setInputError(null);
              }}
              onKeyDown={handleKeyDown}
              maxLength={5}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleAddSlot}
          >
            Agregar
          </Button>
        </div>
        {inputError && (
          <p className="text-xs text-brand-state-error">{inputError}</p>
        )}
      </div>

      {successMessage && (
        <div className="rounded-xl bg-brand-state-success-light border border-brand-state-success-dark px-4 py-2">
          <p className="text-sm font-medium text-brand-state-success-dark">
            {successMessage}
          </p>
        </div>
      )}

      <div className="flex gap-3 mt-auto pt-4 border-t border-brand-border">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={handleDiscard}
          disabled={isPending}
        >
          Descartar
        </Button>
        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={handleSave}
          loading={isPending}
        >
          Guardar cambios
        </Button>
      </div>
    </div>
  );
};

export default ScheduleEditor;
