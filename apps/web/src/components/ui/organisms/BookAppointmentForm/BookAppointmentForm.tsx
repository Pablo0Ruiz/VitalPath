'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/atoms/Card';
import { Button } from '@/components/ui/atoms/Button';
import { Input } from '@/components/ui/atoms/Input';
import { Select } from '@/components/ui/atoms/Select';
import { FormField } from '@/components/ui/molecules/FormField';
import {
  useCitasAdministrator,
  useDoctors,
  useScheduleForPatient,
  useUpdateCitaByWorker,
  parseApiError,
} from '@repo/api-client';
import {
  bookAppointmentSchema,
  type BookAppointmentFormData,
  type CitaPopulated,
} from '@repo/types';
import { usePatientOptions } from './useBookAppointmentOptions';
import { deriveAvailableSlots } from './deriveAvailableSlots';

export interface BookAppointmentFormProps {
  mode: 'create' | 'edit';
  initialCita?: CitaPopulated;
  onSuccess: () => void;
  onCancel: () => void;
}

const BookAppointmentForm = ({
  mode,
  initialCita,
  onSuccess,
  onCancel,
}: BookAppointmentFormProps) => {
  const [bannerError, setBannerError] = useState<string | null>(null);

  const { data: citas } = useCitasAdministrator();
  const { data: doctors } = useDoctors();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<BookAppointmentFormData>({
    resolver: zodResolver(bookAppointmentSchema),
    defaultValues:
      mode === 'edit' && initialCita
        ? {
            paciente_ID: initialCita.paciente_ID._id,
            medico_ID: initialCita.medico_ID._id,
            fecha: initialCita.fecha,
            hora: initialCita.hora,
          }
        : undefined,
  });

  const watchedMedicoId = useWatch({
    control,
    name: 'medico_ID',
  });
  const watchedFecha = useWatch({
    control,
    name: 'fecha',
  });

  const selectedDoctor = doctors?.find(d => d._id === watchedMedicoId);

  const patientOptions = usePatientOptions(citas);

  const doctorOptions =
    doctors?.map(d => ({
      value: d._id,
      label: `${d.user.name} ${d.user.lastName} — ${d.especialidad}`,
    })) ?? [];

  const availableSlots = deriveAvailableSlots(
    citas,
    watchedMedicoId,
    watchedFecha,
    selectedDoctor?.slots,
    initialCita?._id,
  );

  const slotOptions = availableSlots.map(slot => ({
    value: slot,
    label: slot,
  }));

  const { mutate: scheduleForPatient, isPending: isCreating } =
    useScheduleForPatient();
  const { mutate: updateCitaByWorker, isPending: isUpdating } =
    useUpdateCitaByWorker();

  const isPending = isCreating || isUpdating;

  const onSubmit = (data: BookAppointmentFormData) => {
    setBannerError(null);

    const centroSaludId = selectedDoctor?.user?.centroSalud_ID?._id;
    if (!centroSaludId) {
      setError('medico_ID', {
        type: 'server',
        message: 'El médico no tiene un centro de salud asignado',
      });
      return;
    }

    if (mode === 'create') {
      scheduleForPatient(
        {
          paciente_ID: data.paciente_ID,
          medico_ID: data.medico_ID,
          centroSalud_ID: centroSaludId,
          fecha: data.fecha,
          hora: data.hora,
        },
        {
          onSuccess,
          onError: error => {
            const parsed = parseApiError(error);
            if (parsed.status === 409) {
              setError('hora', { type: 'server', message: parsed.message });
            } else {
              setBannerError(parsed.message);
            }
          },
        },
      );
    } else if (mode === 'edit' && initialCita) {
      updateCitaByWorker(
        {
          id: initialCita._id,
          payload: {
            medico_ID: data.medico_ID,
            centroSalud_ID: centroSaludId,
            fecha: data.fecha,
            hora: data.hora,
          },
        },
        {
          onSuccess,
          onError: error => {
            const parsed = parseApiError(error);
            if (parsed.status === 409) {
              setError('hora', { type: 'server', message: parsed.message });
            } else {
              setBannerError(parsed.message);
            }
          },
        },
      );
    }
  };

  return (
    <Card padding="none" className="w-full max-w-2xl overflow-hidden">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-8 flex flex-col gap-5"
      >
        <FormField label="Paciente" error={errors.paciente_ID?.message}>
          <Select
            options={patientOptions}
            placeholder="Seleccioná un paciente"
            disabled={mode === 'edit'}
            error={!!errors.paciente_ID}
            {...register('paciente_ID')}
          />
        </FormField>

        <FormField label="Médico" error={errors.medico_ID?.message}>
          <Select
            options={doctorOptions}
            placeholder="Seleccioná un médico"
            error={!!errors.medico_ID}
            {...register('medico_ID')}
          />
        </FormField>

        <FormField
          label="Fecha"
          error={errors.fecha?.message}
          hint="Formato YYYY-MM-DD"
        >
          <Input type="date" error={!!errors.fecha} {...register('fecha')} />
        </FormField>

        <FormField label="Hora" error={errors.hora?.message}>
          <Select
            options={slotOptions}
            placeholder="Seleccioná un horario"
            error={!!errors.hora}
            disabled={!watchedMedicoId || !watchedFecha}
            {...register('hora')}
          />
        </FormField>

        {bannerError && (
          <p className="text-sm text-brand-state-error text-center">
            {bannerError}
          </p>
        )}

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={isPending}>
            {mode === 'create' ? 'Agendar cita' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default BookAppointmentForm;
