import { router } from 'expo-router';
import { Alert, Image, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { Button, TextField } from '@/src/components/ui/atoms';
import { Divider, FormField } from '@/src/components/ui/molecules';
import { useLogin } from '@/src/hooks/auth';
import { LoginFormValues, loginSchema } from '@/src/interfaces/auth';
import { ROUTES } from '@/src/routes/routes';

const Login = () => {
  const { mutate: login, isPending } = useLogin();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data, {
      onError: () => {
        Alert.alert('Error', 'Credenciales incorrectas');
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center pt-12 pb-10 px-6">
          <View className="w-16 h-16 rounded-2xl bg-brand-violet-600 items-center justify-center mb-5">
            <Image
              source={require('@/assets/images/vitalpath-logo.png')}
              className="w-10 h-10"
              resizeMode="contain"
            />
          </View>
          <TextField
            variant="title"
            className="text-brand-slate-900 font-bold text-[28px] text-center mb-1"
          >
            VitalPath
          </TextField>
          <TextField
            variant="caption"
            className="text-brand-slate-400 text-sm text-center"
          >
            Tu salud, guiada con inteligencia
          </TextField>
        </View>

        <View className="px-6">
          <TextField
            variant="body"
            className="text-brand-slate-900 font-semibold text-[17px] text-left mb-1"
          >
            Iniciar sesión
          </TextField>
          <TextField
            variant="caption"
            className="text-brand-slate-400 text-sm text-left mb-6"
          >
            Accedé a tus métricas de salud personalizadas
          </TextField>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormField
                label="Correo electrónico"
                placeholder="nombre@ejemplo.com"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
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
                placeholder="••••••••"
                secureTextEntry
                rightLabel="¿Olvidaste tu contraseña?"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                rightLabelOnPress={() => router.push(ROUTES.RECOVER_PASSWORD)}
                className="mb-6"
                helperText={errors.password?.message}
              />
            )}
          />

          <Button
            title="Iniciar sesión"
            variant="primary"
            className="mb-4"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting || isPending}
            disabled={isSubmitting || isPending}
          />

          <Divider text="o continuá con" className="mb-4" />

          <View className="items-center mt-2">
            <TextField
              variant="caption"
              className="text-brand-slate-500 text-sm text-center"
              onPress={() => router.push(ROUTES.REGISTER)}
            >
              ¿No tenés cuenta?{'  '}
              <TextField
                variant="caption"
                className="text-brand-violet-600 font-semibold"
              >
                Registrate
              </TextField>
            </TextField>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
