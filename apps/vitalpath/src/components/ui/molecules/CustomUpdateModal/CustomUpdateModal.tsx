import { Modal, View } from 'react-native';
import { useEffect } from 'react';
import { Button, TextField } from '../../atoms';
import { Controller, useForm } from 'react-hook-form';
import {
  useMedicament,
  useUpdateMedication,
} from '@/src/hooks/medicaments/useMedication';
import { FormField } from '../FormField';

export interface CustomUpdateModalProps {
  visible: boolean;
  onClose: () => void;
  id: string;
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
}: CustomUpdateModalProps) => {
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

  const onSubmit = (data: FormValuesUpdate) => {
    if (!medicament) return;
    const payload = {
      id: medicament._id,
      name: data.name,
      description: data.description,
    };
    updateMedication(payload);
    reset();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
      >
        <View
          style={{
            width: 300,
            padding: 20,
            backgroundColor: '#fff',
            borderRadius: 8,
          }}
        >
          <TextField>Datos del medicamento</TextField>
          <Controller
            name="name"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormField
                label="Nombre del medicamento"
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
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                helperText={errors.description?.message}
              />
            )}
          />
          <Button title="Guardar" onPress={handleSubmit(onSubmit)} />
          <Button title="Cerrar" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default CustomUpdateModal;
