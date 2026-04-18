import { ScrollView, View } from 'react-native';
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

const RegisterStep1 = () => {
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
    <View className="flex-1 bg-brand-background">
      <ScrollView
        className="flex-1 bg-brand-background px-6 pt-8"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ProgressBar progress={33} className="mb-6 max-w-[200px] self-center" />

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
              leftIcon={<Octicons name="person" size={24} color="black" />}
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
              leftIcon={<Octicons name="person" size={24} color="black" />}
              helperText={errors.lastName?.message}
              className="mb-8"
            />
          )}
        />

        <Button
          title="Siguiente"
          onPress={handleSubmit(onSubmit)}
          variant="primary"
          className="mb-6"
        />

        <Divider text="O regístrate con" className="mb-6" />

        <View className="flex-row justify-center gap-3 mb-7">
          <SocialButton label="G" />
          <SocialButton label="A" />
          <SocialButton label="F" />
        </View>

        <TextField
          variant="caption"
          className="text-sm self-center"
          onPress={() => router.replace(ROUTES.LOGIN)}
        >
          ¿Ya tienes una cuenta?{' '}
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

export default RegisterStep1;
