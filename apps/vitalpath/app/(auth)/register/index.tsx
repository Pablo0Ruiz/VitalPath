import { useState } from 'react';
import { View, ScrollView, Alert, Pressable } from 'react-native';

import Octicons from '@expo/vector-icons/Octicons';
import { router } from 'expo-router';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { ROUTES } from '@/src/routes/routes';
import { Button, SocialButton, TextField } from '@/src/components/ui/atoms';
import { AuthHeader, Divider, FormField } from '@/src/components/ui/molecules';
import { RegisterFormValues, registerSchema } from '@/src/interfaces/auth';
import { useAuth } from '@/src/context/AuthContext';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      lastName: '',
      email: '',
      password: '',
      fechaNacimiento: '',
      genero: 'Otro',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    const response = await register(data);
    //TODO:esto se va a cambiar por toast
    if (!response) {
      Alert.alert('Error', 'Error al registrar');
      setIsLoading(false);
      return;
    }

    router.replace(ROUTES.HOME);
    setIsLoading(false);
  };

  return (
    <View className="flex-1 bg-brand-background">
      <ScrollView
        className="flex-1 bg-brand-background px-6 pt-8"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <AuthHeader
          title="Crear cuenta"
          subtitle="Comienza a monitorear tu salud de forma personalizada"
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
            />
          )}
        />

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
          name="fechaNacimiento"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label="Fecha de nacimiento"
              placeholder="DD/MM/AAAA"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              keyboardType="numeric"
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon={<Octicons name="calendar" size={24} color="black" />}
              helperText={errors.fechaNacimiento?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="genero"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label="Género"
              placeholder="Masculino"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              keyboardType="default"
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon={<Octicons name="person" size={24} color="black" />}
              helperText={errors.genero?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label="Contraseña"
              placeholder="Mínimo 8 caracteres"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon={<Octicons name="lock" size={24} color="black" />}
              rightIcon={
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Octicons
                    name={showPassword ? 'eye' : 'eye-closed'}
                    size={22}
                    color="black"
                  />
                </Pressable>
              }
              helperText={errors.password?.message}
            />
          )}
        />

        <Button
          title={isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
          onPress={handleSubmit(onSubmit)}
          variant="primary"
          disabled={isLoading}
          className="mb-6"
        />

        <Divider text="O regístrate con" className="mb-6" />

        <View className="flex-row gap-3 mb-7">
          <SocialButton label="G" />
          <SocialButton label="A" />
          <SocialButton label="F" />
        </View>

        <TextField
          variants="caption"
          className="text-sm"
          onPress={() => router.replace(ROUTES.LOGIN)}
        >
          ¿Ya tienes una cuenta?{' '}
          <TextField
            variants="caption"
            className="text-brand-violet-600 font-semibold"
          >
            Iniciar sesión
          </TextField>
        </TextField>
      </ScrollView>
    </View>
  );
};

export default Register;
