import { Button } from '@/src/components/ui/atoms';
import {
  AuthFooterLink,
  AuthHeader,
  FormField,
} from '@/src/components/ui/molecules';
import { AuthLayout } from '@/src/components/ui/organisms';
import { useRecoverPassword } from '@repo/api-client';
import { RecoverPasswordFormValues, recoverPasswordSchema } from '@repo/types';
import { ROUTES } from '@/src/routes/routes';
import Octicons from '@expo/vector-icons/Octicons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet } from 'react-native';
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
    <AuthLayout
      heroContent={
        <AuthHeader
          title="Recuperar contraseña"
          subtitle="Ingresá tu correo y te enviamos un enlace para restablecer tu contraseña"
        />
      }
    >
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

      <AuthFooterLink
        text="¿Recordaste tu contraseña?"
        linkText="Iniciar sesión"
        onPress={handleGoBack}
      />
    </AuthLayout>
  );
};

const s = StyleSheet.create({
  emailField: { marginBottom: 24 },
  submitButton: { marginBottom: 24 },
});

export default RecoverPassword;
