import { Alert, StyleSheet } from 'react-native';

import { router, useLocalSearchParams } from 'expo-router';
import Octicons from '@expo/vector-icons/Octicons';

import { Button, TextField } from '@/src/components/ui/atoms';
import { AuthHeader } from '@/src/components/ui/molecules';
import { AuthLayout } from '@/src/components/ui/organisms/AuthLayout';
import { useRecoverPassword } from '@repo/api-client';
import { ROUTES } from '@/src/routes/routes';
import { useTheme } from '@/src/hooks/useTheme';

const RecoverPasswordEmailSent = () => {
  const t = useTheme();
  const { email } = useLocalSearchParams<Record<string, string>>();

  const { mutateAsync, isPending } = useRecoverPassword();

  const handleResendEmail = async () => {
    if (!email) return;
    try {
      await mutateAsync(email);
      Alert.alert(
        'Correo enviado',
        'Se ha enviado un correo electrónico a tu cuenta',
      );
    } catch {
      Alert.alert('Error', 'No se pudo enviar el correo electrónico');
    }
  };

  const handleGoBack = () => {
    router.replace(ROUTES.LOGIN);
  };

  return (
    <AuthLayout
      heroContent={
        <AuthHeader
          title="¡Correo enviado!"
          subtitle={
            email
              ? `Hemos enviado las instrucciones para restablecer tu contraseña a ${email}`
              : 'Revisá tu bandeja de entrada'
          }
        />
      }
    >
      <Octicons
        name="check-circle-fill"
        size={60}
        color={t.success}
        style={s.icon}
      />

      <TextField
        variant="caption"
        style={[
          s.description,
          { color: t.textSecondary, fontSize: t.fontSizeCaption },
        ]}
      >
        Revisá tu bandeja de entrada y seguí las instrucciones para crear una
        nueva contraseña.
      </TextField>

      <Button
        title="Volver al inicio de sesión"
        onPress={handleGoBack}
        variant="primary"
        style={s.primaryButton}
      />

      <Button
        title={isPending ? 'Enviando...' : '¿No recibiste el correo? Reenviar'}
        onPress={handleResendEmail}
        variant="outline"
        disabled={isPending}
      />
    </AuthLayout>
  );
};

const s = StyleSheet.create({
  icon: { alignSelf: 'center', marginBottom: 24 },
  description: {
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 16,
  },
  primaryButton: { marginBottom: 16 },
});

export default RecoverPasswordEmailSent;
