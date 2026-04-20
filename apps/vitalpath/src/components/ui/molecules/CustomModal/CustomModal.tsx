import { Modal, View } from 'react-native';
import { Button, TextField } from '../../atoms';
import { Controller, useForm } from 'react-hook-form';
import { useCreateMedication } from '@repo/api-client';
import { FormField } from '../FormField';

export interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
}

type FormValues = {
  name: string;
  description?: string;
};

const CustomModal = ({ visible, onClose }: CustomModalProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  const { mutateAsync: createMedication } = useCreateMedication();

  const onSubmit = async (data: FormValues) => {
    try {
      await createMedication(data);
      reset();
      onClose();
    } catch (error) {
      // El error ya se loguea en el hook, pero acá podrías mostrar una alerta
      console.error('Error al guardar:', error);
    }
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
          <TextField
            variant="title"
            className="font-semibold text-center text-lg mb-2"
          >
            Datos del medicamento
          </TextField>
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
          <View className="gap-2 mt-2">
            <Button title="Guardar" onPress={handleSubmit(onSubmit)} />
            <Button title="Cerrar" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;
