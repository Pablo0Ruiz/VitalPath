import { Button, TextField } from '@/src/components/ui/atoms';
import { AuthHeader, FormField } from '@/src/components/ui/molecules';
import { useRecoverPassword } from '@repo/api-client';
import { RecoverPasswordFormValues, recoverPasswordSchema } from '@repo/types';
import { ROUTES } from '@/src/routes/routes';
import Octicons from '@expo/vector-icons/Octicons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';

const RecoverPassword = () => {
  const t = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RecoverPasswordFormValues>({
    resolver: zodResolver(recoverPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const { mutateAsync, isPending } = useRecoverPassword();

  const handleResetPassword = async (data: RecoverPasswordFormValues) => {
    try {
      await mutateAsync(data.email);
      router.push({
        pathname: ROUTES.RECOVER_PASSWORD_EMAIL_SENT,
        params: { email: data.email },
      } as never);
    } catch {
      Alert.alert('Error', 'No se pudo enviar el correo electrónico');
    }
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(ROUTES.LOGIN);
    }
  };

  return (
    <View style={[s.container, { backgroundColor: t.background }]}>
      <ScrollView
        style={s.flex1}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AuthHeader
          title="Recuperar contraseña"
          subtitle="Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña"
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label="Correo electrónico"
              placeholder="nombre@ejemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              leftIcon={
                <Octicons name="mail" size={20} color={t.textSecondary} />
              }
              style={s.emailField}
              helperText={errors.email?.message}
            />
          )}
        />

        <Button
          title={isPending ? 'Enviando...' : 'Enviar instrucciones'}
          onPress={handleSubmit(handleResetPassword)}
          variant="primary"
          disabled={isPending}
          style={s.submitButton}
        />

        <TextField
          variant="caption"
          style={[s.footerText, { color: t.textSecondary }]}
          onPress={handleGoBack}
        >
          ¿Recordaste tu contraseña?{' '}
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
  backWrapper: { marginBottom: 16 },
  backButton: { alignSelf: 'flex-start' },
  emailField: { marginBottom: 24 },
  submitButton: { marginBottom: 24 },
  footerText: { fontSize: 14, textAlign: 'center' },
  linkText: { fontWeight: '700' },
});

export default RecoverPassword;
