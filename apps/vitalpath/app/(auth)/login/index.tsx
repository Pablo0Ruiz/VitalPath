import { Alert, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import Octicons from '@expo/vector-icons/Octicons';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, SocialButton, TextField } from '@/src/components/ui/atoms';
import { AuthHeader, Divider, FormField } from '@/src/components/ui/molecules';
import { ROUTES } from '@/src/routes/routes';
import { LoginFormValues, loginSchema } from '@/src/interfaces/auth';
import { useAuth } from '@/src/context/AuthContext';

const Login = () => {
  const { login } = useAuth();
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

  const onSubmit = async (data: LoginFormValues) => {
    const response = await login(data);

    if (!response) {
      Alert.alert('Error', 'Credenciales incorrectas');
      return;
    }

    router.replace(ROUTES.HOME);
  };

  return (
    <View className="flex-1 bg-brand-background">
      <ScrollView
        className="flex-1 rounded-t-3xl bg-brand-background px-6 pt-8"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <AuthHeader
          title="Welcome back"
          subtitle="Access your personalized health metrics"
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label="Email Address"
              placeholder="name@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Octicons name="mail" size={24} color="black" />}
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
              label="Password"
              placeholder="••••••••"
              secureTextEntry
              rightLabel="Olvidaste tu contraseña?"
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
          title="Sign In"
          variant="primary"
          className="mb-6"
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        />

        <TextField
          className="mb-6"
          onPress={() => router.push(ROUTES.REGISTER)}
        >
          ¿No tienes una cuenta?
          <TextField
            variants="caption"
            className="text-brand-violet-600 font-semibold"
          >
            Registrarse
          </TextField>
        </TextField>

        <Divider text="Or continue with" className="mb-6" />

        <View className="flex-row gap-3">
          <SocialButton label="G" />
          <SocialButton label="A" />
          <SocialButton label="F" />
        </View>
      </ScrollView>
    </View>
  );
};

export default Login;
