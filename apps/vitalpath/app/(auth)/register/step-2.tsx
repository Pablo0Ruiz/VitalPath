import Octicons from '@expo/vector-icons/Octicons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';

import { Button, ProgressBar } from '@/src/components/ui/atoms';
import {
  AuthHeader,
  FormField,
  GenderForm,
} from '@/src/components/ui/molecules';
import { AuthLayout } from '@/src/components/ui/organisms';
import { formatDateInput } from '@/src/utils/formatDateInput';
import { Step2FormValues, step2Schema } from '@repo/types';
import { useRegisterStore } from '@repo/store';
import { ROUTES } from '@/src/routes/routes';
import { GENDER } from '@/src/constants/gender';
import { useTheme } from '@/src/hooks/useTheme';

const RegisterStep2 = () => {
  const t = useTheme();
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
    <AuthLayout
      heroContent={
        <AuthHeader title="Detalles personales" subtitle="(Paso 2 de 3)" />
      }
    >
      <ProgressBar progress={66} style={s.progressBar} />

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
            leftIcon={
              <Octicons name="calendar" size={20} color={t.textSecondary} />
            }
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
        style={s.button}
      />
    </AuthLayout>
  );
};

const s = StyleSheet.create({
  progressBar: { marginBottom: 40, maxWidth: 200, alignSelf: 'center' },
  button: { marginTop: 16 },
});

export default RegisterStep2;
