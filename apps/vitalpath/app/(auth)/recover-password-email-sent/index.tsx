import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { router, useLocalSearchParams } from 'expo-router';
import { Octicons } from '@expo/vector-icons';

import { Button, TextField } from '@/src/components/ui/atoms';
import { AuthHeader } from '@/src/components/ui/molecules';
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
    <View style={[s.container, { backgroundColor: t.background }]}>
      <ScrollView
        style={s.flex1}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AuthHeader
          title="¡Correo enviado!"
          subtitle={`Hemos enviado las instrucciones para restablecer tu contraseña a ${email}`}
        />

        <View style={s.iconWrapper}>
          <Octicons name="check-circle-fill" size={60} color={t.success} />
        </View>

        <TextField
          variant="caption"
          style={[s.description, { color: t.textSecondary }]}
        >
          Revisa tu bandeja de entrada y sigue las instrucciones para crear una
          nueva contraseña.
        </TextField>

        <Button
          title="Volver al inicio de sesión"
          onPress={handleGoBack}
          variant="primary"
          style={s.primaryButton}
        />

        <Button
          title={
            isPending ? 'Enviando...' : '¿No recibiste el correo? Reenviar'
          }
          onPress={handleResendEmail}
          variant="outline"
          disabled={isPending}
        />
      </ScrollView>
    </View>
  );
};

const s = StyleSheet.create({
  container: { flex: 1 },
  flex1: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 48 },
  iconWrapper: { alignItems: 'center', marginBottom: 32 },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 16,
    lineHeight: 20,
  },
  primaryButton: { marginBottom: 16 },
});

export default RecoverPasswordEmailSent;
