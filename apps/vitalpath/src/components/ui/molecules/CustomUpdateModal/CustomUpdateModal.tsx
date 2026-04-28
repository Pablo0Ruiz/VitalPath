import { Modal, StyleSheet, View } from 'react-native';
import { useEffect } from 'react';
import { Button, TextField } from '../../atoms';
import { Controller, useForm } from 'react-hook-form';
import { useMedicament, useUpdateMedication } from '@repo/api-client';
import { FormField } from '../FormField';
import { useTheme } from '@/src/hooks/useTheme';

export interface CustomUpdateModalProps {
  visible: boolean;
  onClose: () => void;
  id: string;
  onSuccess?: () => void;
}

type FormValuesUpdate = {
  name?: string;
  description?: string;
  id: string;
};

const CustomUpdateModal = ({
  visible,
  onClose,
  id,
  onSuccess,
}: CustomUpdateModalProps) => {
  const t = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValuesUpdate>();

  const { mutateAsync: updateMedication } = useUpdateMedication();
  const { data: medicament } = useMedicament(id, visible);

  useEffect(() => {
    if (medicament) {
      reset({
        name: medicament.name,
        description: medicament.description,
        id: medicament._id,
      });
    }
  }, [medicament, reset]);

  const onSubmit = async (data: FormValuesUpdate) => {
    if (!medicament) return;
    const payload = {
      id: medicament._id,
      name: data.name,
      description: data.description,
    };
    await updateMedication(payload);
    reset();
    onClose();
    onSuccess?.();
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
          <TextField
            variant="title"
            style={[s.title, { color: t.textPrimary }]}
          >
            Editar medicamento
          </TextField>
          <Controller
            name="name"
            control={control}
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
          <View style={s.footer}>
            <Button title="Guardar" onPress={handleSubmit(onSubmit)} />
            <Button title="Cerrar" variant="outline" onPress={onClose} />
          </View>
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
  footer: { gap: 12, marginTop: 12 },
});

export default CustomUpdateModal;
