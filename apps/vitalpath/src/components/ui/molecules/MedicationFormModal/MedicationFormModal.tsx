import { Modal, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';
import { Button, TextField } from '../../atoms';
import { Controller, useForm } from 'react-hook-form';
import {
  useCreateMedication,
  useMedicament,
  useUpdateMedication,
} from '@repo/api-client';
import { FormField } from '../FormField';
import { useTheme } from '@/src/hooks/useTheme';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  scheduleNotifications,
  cancelNotifications,
} from '@/src/utils/medicationNotifications';
import type { MedicationFrequency } from '@repo/types';

export interface MedicationFormModalProps {
  mode: 'create' | 'edit';
  medicationId?: string;
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const FREQUENCY_OPTIONS: MedicationFrequency[] = [4, 6, 8, 12, 24];

type FormValues = {
  name: string;
  description?: string;
  startTime?: string;
  frequencyHours: MedicationFrequency;
  durationDays?: string;
};

export const MedicationFormModal = ({
  mode,
  medicationId,
  visible,
  onClose,
  onSuccess,
}: MedicationFormModalProps) => {
  const t = useTheme();
  const isEdit = mode === 'edit';

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormValues>({
    defaultValues: { frequencyHours: 24 },
  });

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timeDate, setTimeDate] = useState<Date | undefined>(undefined);

  const { mutateAsync: createMedication } = useCreateMedication();
  const { mutateAsync: updateMedication } = useUpdateMedication();

  const { data: medicament } = useMedicament(
    medicationId ?? '',
    isEdit && visible,
  );

  const selectedFrequency = watch('frequencyHours');

  useEffect(() => {
    if (isEdit && medicament) {
      let parsedTime: Date | undefined;
      if (medicament.startTime) {
        const [h, m] = medicament.startTime.split(':').map(Number);
        const d = new Date();
        d.setHours(h, m, 0, 0);
        parsedTime = d;
      }

      reset({
        name: medicament.name,
        description: medicament.description,
        startTime: medicament.startTime,
        frequencyHours:
          (medicament.frequencyHours as MedicationFrequency) ?? 24,
        durationDays: medicament.durationDays?.toString(),
      });
      setTimeDate(parsedTime);
    }
  }, [isEdit, medicament, reset]);

  const handleTimeChange = (_event: unknown, selected?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selected) {
      setTimeDate(selected);
      const hours = selected.getHours().toString().padStart(2, '0');
      const minutes = selected.getMinutes().toString().padStart(2, '0');
      setValue('startTime', `${hours}:${minutes}`);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      if (isEdit) {
        await handleEditSubmit(data);
      } else {
        await handleCreateSubmit(data);
      }

      reset({ frequencyHours: 24 });
      setTimeDate(undefined);
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  const handleCreateSubmit = async (data: FormValues) => {
    const payload = {
      name: data.name,
      description: data.description,
      startTime: data.startTime,
      frequencyHours: data.frequencyHours,
      durationDays: data.durationDays
        ? parseInt(data.durationDays, 10)
        : undefined,
    };

    const medication = await createMedication(payload);

    if (medication && data.startTime) {
      const notificationIds = await scheduleNotifications({
        name: data.name,
        startTime: data.startTime,
        frequencyHours: data.frequencyHours,
        durationDays: payload.durationDays,
      });

      if (notificationIds.length > 0 && medication._id) {
        try {
          await updateMedication({
            id: medication._id,
            notificationIds,
          });
        } catch {
          await cancelNotifications(notificationIds);
        }
      }
    }
  };

  const handleEditSubmit = async (data: FormValues) => {
    if (!medicament) return;

    if (medicament.notificationIds?.length) {
      await cancelNotifications(medicament.notificationIds);
    }

    const durationDays = data.durationDays
      ? parseInt(data.durationDays, 10)
      : undefined;

    const payload = {
      id: medicament._id,
      name: data.name,
      description: data.description,
      startTime: data.startTime,
      frequencyHours: data.frequencyHours,
      durationDays,
    };

    await updateMedication(payload);

    if (data.startTime) {
      const notificationIds = await scheduleNotifications({
        name: data.name ?? medicament.name,
        startTime: data.startTime,
        frequencyHours: data.frequencyHours,
        durationDays,
      });

      if (notificationIds.length > 0) {
        try {
          await updateMedication({
            id: medicament._id,
            notificationIds,
          });
        } catch {
          await cancelNotifications(notificationIds);
        }
      }
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={s.overlay}>
        <View style={[s.content, { backgroundColor: t.surfaceElevated }]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <TextField
              variant="title"
              style={[s.title, { color: t.textPrimary }]}
            >
              {isEdit ? 'Editar medicamento' : 'Datos del medicamento'}
            </TextField>

            <Controller
              name="name"
              control={control}
              rules={
                isEdit ? undefined : { required: 'El nombre es requerido' }
              }
              render={({ field: { onChange, onBlur, value } }) => (
                <FormField
                  label="Nombre del medicamento"
                  error={!!errors.name}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  helperText={errors.name?.message}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <FormField
                  label="Descripción"
                  error={!!errors.description}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  helperText={errors.description?.message}
                />
              )}
            />

            <View style={s.fieldRow}>
              <TextField style={[s.label, { color: t.textSecondary }]}>
                Hora de inicio (opcional)
              </TextField>
              <Button
                title={
                  timeDate
                    ? `${timeDate.getHours().toString().padStart(2, '0')}:${timeDate.getMinutes().toString().padStart(2, '0')}`
                    : 'Seleccionar hora'
                }
                variant="outline"
                size="sm"
                onPress={() => setShowTimePicker(true)}
              />
              {showTimePicker && (
                <DateTimePicker
                  value={timeDate ?? new Date()}
                  mode="time"
                  is24Hour
                  display="default"
                  onChange={handleTimeChange}
                />
              )}
            </View>

            <View style={s.fieldRow}>
              <TextField style={[s.label, { color: t.textSecondary }]}>
                Frecuencia
              </TextField>
              <View style={s.frequencyRow}>
                {FREQUENCY_OPTIONS.map(opt => (
                  <Button
                    key={opt}
                    title={`${opt}h`}
                    size="sm"
                    variant={selectedFrequency === opt ? 'primary' : 'outline'}
                    onPress={() => setValue('frequencyHours', opt)}
                    style={s.freqButton}
                  />
                ))}
              </View>
            </View>

            <Controller
              name="durationDays"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <FormField
                  label="Duración en días (opcional)"
                  error={!!errors.durationDays}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="numeric"
                  helperText={
                    errors.durationDays?.message ??
                    'Déjalo vacío para tratamiento indefinido'
                  }
                />
              )}
            />

            <View style={s.footer}>
              <Button title="Guardar" onPress={handleSubmit(onSubmit)} />
              <Button title="Cerrar" variant="outline" onPress={onClose} />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    width: 320,
    maxHeight: '80%',
    padding: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  fieldRow: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    marginBottom: 6,
  },
  frequencyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  freqButton: {
    minWidth: 44,
  },
  footer: { gap: 12, marginTop: 12 },
});

export default MedicationFormModal;
