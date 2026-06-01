import { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';

import { router } from 'expo-router';
import Octicons from '@expo/vector-icons/Octicons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { Button, ProgressBar } from '@/src/components/ui/atoms';
import { AuthHeader, FormField } from '@/src/components/ui/molecules';
import { AuthLayout } from '@/src/components/ui/organisms';
import { Step3FormValues, step3Schema } from '@repo/types';
import { useRegisterStore } from '@repo/store';
import { useRegister, parseApiError } from '@repo/api-client';
import { useAuthStore } from '@/src/stores/auth';
import { mobileTokenAdapter } from '@/src/adapters/mobileTokenAdapter';
import { ROUTES } from '@/src/routes/routes';
import { useTheme } from '@/src/hooks/useTheme';
import { useSeniorUIStore } from '@/src/stores/seniorUI.store';
import { isElderlyUser } from '@/src/utils/date';

const RegisterStep3 = () => {
  const t = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const { draft, setStep3, getAll, reset } = useRegisterStore();
  const { setSession } = useAuthStore();
  const { hasSeenSuggestion } = useSeniorUIStore();

  const successRoute =
    isElderlyUser(draft.fechaNacimiento) && !hasSeenSuggestion
      ? ROUTES.SENIOR_UI_SUGGESTION
      : ROUTES.HOME;

  const { mutate: registerMutation, isPending } = useRegister(
    mobileTokenAdapter,
    { setSession },
    { successRoute },
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Step3FormValues>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      email: draft.email ?? '',
      password: draft.password ?? '',
    },
  });

  const onSubmit = (data: Step3FormValues) => {
    setStep3(data);

    const fullData = getAll();

    if (!fullData) {
      Alert.alert(
        'Error',
        'Faltan datos de los pasos anteriores. Por favor verifica.',
      );
      return;
    }

    registerMutation(fullData, {
      onSuccess: () => {
        reset();
      },
      onError: error => {
        Alert.alert('Error', parseApiError(error).message);
      },
    });
  };

  return (
    <AuthLayout
      heroContent={<AuthHeader title="Credenciales" subtitle="(Paso 3 de 3)" />}
    >
      <ProgressBar progress={100} style={s.progressBar} />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormField
            label="Correo electrónico"
            placeholder="nombre@ejemplo.com"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon={
              <Octicons name="mail" size={20} color={t.textSecondary} />
            }
            helperText={errors.email?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormField
            label="Contraseña"
            placeholder="Mínimo 6 caracteres"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon={
              <Octicons name="lock" size={20} color={t.textSecondary} />
            }
            rightIcon={
              <Button
                variant="ghost"
                size="sm"
                onPress={() => setShowPassword(!showPassword)}
              >
                <Octicons
                  name={showPassword ? 'eye' : 'eye-closed'}
                  size={20}
                  color={t.textSecondary}
                />
              </Button>
            }
            helperText={errors.password?.message}
            style={s.passwordField}
          />
        )}
      />

      <Button
        title={isPending ? 'Creando cuenta...' : 'Finalizar registro'}
        onPress={handleSubmit(onSubmit)}
        variant="primary"
        disabled={isPending}
      />
    </AuthLayout>
  );
};

const s = StyleSheet.create({
  progressBar: { marginBottom: 40, maxWidth: 200, alignSelf: 'center' },
  passwordField: { marginBottom: 32 },
});

export default RegisterStep3;
