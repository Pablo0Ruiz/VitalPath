import { Button, TextField } from '@/src/components/ui/atoms';
import { AuthHeader, FormField } from '@/src/components/ui/molecules';
import { useRecoverPassword } from '@/src/hooks/auth/useRecoverPassword';
import {
  RecoverPasswordFormValues,
  recoverPasswordSchema,
} from '@/src/interfaces/auth';
import { ROUTES } from '@/src/routes/routes';
import Octicons from '@expo/vector-icons/Octicons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Alert, ScrollView, View } from 'react-native';

const RecoverPassword = () => {
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
    <View className="flex-1 bg-brand-background">
      <ScrollView
        className="flex-1 px-6 pt-8"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-4">
          <Button
            title="← Volver"
            onPress={handleGoBack}
            variant="outline"
            className="self-start px-3 py-2"
          />
        </View>

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
              leftIcon={<Octicons name="mail" size={24} color="black" />}
              className="mb-6"
              helperText={errors.email?.message}
            />
          )}
        />

        <Button
          title={isPending ? 'Enviando...' : 'Enviar instrucciones'}
          onPress={handleSubmit(handleResetPassword)}
          variant="primary"
          disabled={isPending}
          className="mb-6"
        />

        <TextField
          variant="caption"
          className="text-center text-sm text-brand-slate-400"
          onPress={handleGoBack}
        >
          ¿Recordaste tu contraseña?{' '}
          <TextField
            variant="caption"
            className="text-brand-violet-600 font-semibold"
          >
            Iniciar sesión
          </TextField>
        </TextField>
      </ScrollView>
    </View>
  );
};

export default RecoverPassword;
