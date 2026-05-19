import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { router } from 'expo-router';

import { Button, TextField } from '@/src/components/ui/atoms';
import {
  AuthHeader,
  FormField,
  GenderForm,
} from '@/src/components/ui/molecules';
import { useAuthStore } from '@/src/stores/auth';
import { mobileTokenAdapter } from '@/src/adapters/mobileTokenAdapter';
import { ROUTES } from '@/src/routes/routes';
import { useTheme } from '@/src/hooks/useTheme';
import {
  RegisterCuidadorFormValues,
  registerCuidadorSchema,
} from '@repo/types';
import { useRegisterCuidador } from '@repo/api-client';
import { formatDateInput } from '@/src/utils/formatDateInput';
import { GENDER } from '@/src/constants/gender';

export default function RegisterCuidadorScreen() {
  const t = useTheme();
  const { setSession } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: register, isPending } = useRegisterCuidador(
    mobileTokenAdapter,
    { setSession },
    { successRoute: ROUTES.HOME },
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterCuidadorFormValues>({
    resolver: zodResolver(registerCuidadorSchema),
    defaultValues: {
      name: '',
      lastName: '',
      fechaNacimiento: '',
      genero: 'Masculino',
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: RegisterCuidadorFormValues) => {
    register(
      { ...data, role: 'CUIDADOR_FAMILIAR' },
      {
        onError: () =>
          Alert.alert(
            'Error',
            'No se pudo crear la cuenta. Verificá los datos e intentá de nuevo.',
          ),
      },
    );
  };

  return (
    <View style={[s.container, { backgroundColor: t.background }]}>
      <ScrollView
        style={s.flex1}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <AuthHeader
          title="Registrarme como Cuidador"
          subtitle="Acompañá a tu familiar de forma segura"
        />

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label="Nombre"
              placeholder="Juan"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              autoCapitalize="words"
              autoCorrect={false}
              leftIcon={
                <Octicons name="person" size={20} color={t.textSecondary} />
              }
              helperText={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label="Apellido"
              placeholder="Pérez"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              autoCapitalize="words"
              autoCorrect={false}
              leftIcon={
                <Octicons name="person" size={20} color={t.textSecondary} />
              }
              helperText={errors.lastName?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="fechaNacimiento"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label="Fecha de nacimiento"
              placeholder="DD/MM/AAAA"
              value={value}
              onBlur={onBlur}
              onChangeText={text => onChange(formatDateInput(text))}
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
                  onPress={() => setShowPassword(v => !v)}
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
          title="Crear cuenta"
          variant="primary"
          loading={isPending}
          onPress={handleSubmit(onSubmit)}
          style={s.submitButton}
        />

        <TextField
          variant="caption"
          style={[s.footerText, { color: t.textSecondary }]}
          onPress={() => router.replace(ROUTES.LOGIN)}
        >
          ¿Ya tenés cuenta?{'  '}
          <TextField
            variant="caption"
            style={[s.linkText, { color: t.primary600 }]}
          >
            Iniciar sesión
          </TextField>
        </TextField>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  flex1: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 48 },
  passwordField: { marginBottom: 32 },
  submitButton: { marginBottom: 24 },
  footerText: { fontSize: 14, alignSelf: 'center' },
  linkText: { fontWeight: '700' },
});
