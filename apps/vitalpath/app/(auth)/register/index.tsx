import { ScrollView, StyleSheet, View } from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';
import { router } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import {
  Button,
  ProgressBar,
  SocialButton,
  TextField,
} from '@/src/components/ui/atoms';
import { AuthHeader, Divider, FormField } from '@/src/components/ui/molecules';
import { Step1FormValues, step1Schema } from '@repo/types';
import { ROUTES } from '@/src/routes/routes';
import { useRegisterStore } from '@repo/store';
import { useTheme } from '@/src/hooks/useTheme';

const RegisterStep1 = () => {
  const t = useTheme();
  const { draft, setStep1 } = useRegisterStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Step1FormValues>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      name: draft.name ?? '',
      lastName: draft.lastName ?? '',
    },
  });

  const onSubmit = (data: Step1FormValues) => {
    setStep1(data);
    router.push(ROUTES.REGISTER_STEP_2);
  };

  return (
    <View style={[s.container, { backgroundColor: t.background }]}>
      <ScrollView
        style={s.flex1}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ProgressBar progress={33} style={s.progressBar} />

        <AuthHeader
          title="Crear cuenta"
          subtitle="Comienza a monitorear tu salud (1/3)"
        />

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label="Nombre completo"
              placeholder="Juan Pérez"
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
              placeholder="Perez"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="words"
              autoCorrect={false}
              leftIcon={
                <Octicons name="person" size={20} color={t.textSecondary} />
              }
              helperText={errors.lastName?.message}
              style={s.lastNameField}
            />
          )}
        />

        <Button
          title="Siguiente"
          onPress={handleSubmit(onSubmit)}
          variant="primary"
          style={s.button}
        />

        <Divider text="O regístrate con" style={s.divider} />

        <View style={s.socialRow}>
          <SocialButton label="G" />
          <SocialButton label="A" />
          <SocialButton label="F" />
        </View>

        <TextField
          variant="caption"
          style={[s.footerText, { color: t.textSecondary }]}
          onPress={() => router.replace(ROUTES.LOGIN)}
        >
          ¿Ya tienes una cuenta?{' '}
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
};

const s = StyleSheet.create({
  container: { flex: 1 },
  flex1: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 48 },
  progressBar: { marginBottom: 24, maxWidth: 200, alignSelf: 'center' },
  lastNameField: { marginBottom: 32 },
  button: { marginBottom: 24 },
  divider: { marginBottom: 24 },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 28,
  },
  footerText: { fontSize: 14, alignSelf: 'center' },
  linkText: { fontWeight: '700' },
});

export default RegisterStep1;
