import Octicons from '@expo/vector-icons/Octicons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { Button, ProgressBar, TextField } from '@/src/components/ui/atoms';
import { FormField, GenderForm } from '@/src/components/ui/molecules';
import { formatDateInput } from '@/src/core/actions/helpers/formatDateInput';
import {
  Step2FormValues,
  step2Schema,
} from '@/src/interfaces/auth/register/register.interface';
import { useRegisterStore } from '@/src/store/registerStore';

import { ROUTES } from '@/src/routes/routes';
import { GENDER } from '@/src/constants/gender';

const RegisterStep2 = () => {
  const { draft, setStep2 } = useRegisterStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Step2FormValues>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      fechaNacimiento: draft.fechaNacimiento ?? '',
      genero: draft.genero ?? 'Masculino',
    },
  });

  const onSubmit = (data: Step2FormValues) => {
    setStep2(data);
    router.push(ROUTES.REGISTER_STEP_3);
  };

  return (
    <View className="flex-1 bg-brand-background px-6 pt-16">
      <Button
        onPress={() => router.back()}
        className="absolute top-16 left-6 z-10 w-10 h-10 items-center justify-center rounded-full bg-slate-50"
      >
        <Octicons name="arrow-left" size={24} color="#0f172a" />
      </Button>

      <ProgressBar progress={66} className="mb-10 max-w-[200px] self-center" />

      <TextField variants="title" className="mb-2 text-center">
        Detalles Personales
      </TextField>
      <TextField variants="caption" className="text-center text-slate-500 mb-8">
        (Paso 2 de 3)
      </TextField>

      <Controller
        control={control}
        name="fechaNacimiento"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormField
            label="Fecha de nacimiento"
            placeholder="DD/MM/AAAA"
            value={value}
            onBlur={onBlur}
            onChangeText={text => {
              const formatted = formatDateInput(text);
              onChange(formatted);
            }}
            keyboardType="numeric"
            maxLength={10}
            leftIcon={<Octicons name="calendar" size={24} color="black" />}
            helperText={errors.fechaNacimiento?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="genero"
        render={({ field: { onChange, value } }) => (
          <GenderForm
            value={value}
            onChange={onChange}
            errorMessage={errors.genero?.message}
            list={GENDER}
          />
        )}
      />

      <Button
        title="Siguiente"
        onPress={handleSubmit(onSubmit)}
        variant="primary"
        className="mt-4"
      />
    </View>
  );
};

export default RegisterStep2;
