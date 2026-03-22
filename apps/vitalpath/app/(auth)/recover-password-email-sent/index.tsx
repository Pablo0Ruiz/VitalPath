import { Alert, ScrollView, View } from 'react-native';
import { Button, TextField } from '@/src/components/ui/atoms';
import { AuthHeader } from '@/src/components/ui/molecules';
import { useRecoverPassword } from '@/src/hooks/useRecoverPassword';
import { ROUTES } from '@/src/routes/routes';
import { Octicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

const RecoverPasswordEmailSent = () => {
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
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(ROUTES.LOGIN);
    }
  };

  return (
    <View className="flex-1 bg-brand-background">
      <ScrollView
        className="flex-1 px-6 pt-8"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <AuthHeader
          title="¡Correo enviado!"
          subtitle={`Hemos enviado las instrucciones para restablecer tu contraseña a ${email}`}
        />

        <View className="items-center mb-8">
          <Octicons name="check-circle-fill" size={60} color="#0D9488" />
        </View>

        <TextField
          variants="caption"
          className="text-center text-sm text-brand-slate-400 mb-10 px-4 leading-5"
        >
          Revisa tu bandeja de entrada y sigue las instrucciones para crear una
          nueva contraseña.
        </TextField>

        <Button
          title="Volver al inicio de sesión"
          onPress={handleGoBack}
          variant="primary"
          className="mb-6"
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

export default RecoverPasswordEmailSent;
