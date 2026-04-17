import { useState } from 'react';
import { View, Alert } from 'react-native';

import { router } from 'expo-router';
import Octicons from '@expo/vector-icons/Octicons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { Button, ProgressBar, TextField } from '@/src/components/ui/atoms';
import { FormField } from '@/src/components/ui/molecules';
import {
  Step3FormValues,
  step3Schema,
} from '@/src/interfaces/auth/register/register.interface';
import { useRegisterStore } from '@repo/store';
import { useRegister } from '@/src/hooks/auth';

const RegisterStep3 = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { draft, setStep3, getAll, reset } = useRegisterStore();
  const { mutate: registerMutation, isPending } = useRegister();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Step3FormValues>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      email: draft.email ?? '',
      password: draft.password ?? '',
    },
  });

  const onSubmit = (data: Step3FormValues) => {
    setStep3(data);

    const fullData = getAll();

    if (!fullData) {
      Alert.alert(
        'Error',
        'Faltan datos de los pasos anteriores. Por favor verifica.',
      );
      return;
    }

    registerMutation(fullData, {
      onSuccess: () => {
        reset();
      },
      onError: error => {
        Alert.alert('Error', 'No se pudo crear la cuenta. Intente nuevamente.');
      },
    });
  };

  return (
    <View className="flex-1 bg-brand-background px-6 pt-16">
      <Button
        onPress={() => router.back()}
        className="absolute top-16 left-6 z-10 w-10 h-10 items-center justify-center rounded-full bg-slate-50"
      >
        <Octicons name="arrow-left" size={24} color="#0f172a" />
      </Button>

      <ProgressBar progress={100} className="mb-10 max-w-[200px] self-center" />

      <TextField variant="title" className="mb-2 text-center">
        Credenciales
      </TextField>
      <TextField variant="caption" className="text-center text-slate-500 mb-8">
        (Paso 3 de 3)
      </TextField>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormField
            label="Correo electrónico"
            placeholder="nombre@ejemplo.com"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon={<Octicons name="mail" size={24} color="black" />}
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
            placeholder="Mínimo 6 caracteres"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon={<Octicons name="lock" size={24} color="black" />}
            rightIcon={
              <Button onPress={() => setShowPassword(!showPassword)}>
                <Octicons
                  name={showPassword ? 'eye' : 'eye-closed'}
                  size={22}
                  color="black"
                />
              </Button>
            }
            helperText={errors.password?.message}
            className="mb-8"
          />
        )}
      />

      <Button
        title={isPending ? 'Creando cuenta...' : 'Finalizar Registro'}
        onPress={handleSubmit(onSubmit)}
        variant="primary"
        disabled={isPending}
      />
    </View>
  );
};

export default RegisterStep3;
