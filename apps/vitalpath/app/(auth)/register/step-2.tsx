import Octicons from '@expo/vector-icons/Octicons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { Button, ProgressBar, TextField } from '@/src/components/ui/atoms';
import { FormField, GenderForm } from '@/src/components/ui/molecules';
import { formatDateInput } from '@/src/utils/formatDateInput';
import { Step2FormValues, step2Schema } from '@repo/types';
import { useRegisterStore } from '@repo/store';
import { ROUTES } from '@/src/routes/routes';
import { GENDER } from '@/src/constants/gender';
import { useTheme } from '@/src/hooks/useTheme';

const RegisterStep2 = () => {
  const t = useTheme();
  const { draft, setStep2 } = useRegisterStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Step2FormValues>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      fechaNacimiento: draft.fechaNacimiento ?? '',
      genero: draft.genero ?? 'Masculino',
    },
  });

  const onSubmit = (data: Step2FormValues) => {
    setStep2(data);
    router.push(ROUTES.REGISTER_STEP_3);
  };

  return (
    <View style={[s.container, { backgroundColor: t.background }]}>
      <Button
        onPress={() => router.back()}
        style={[s.backButton, { backgroundColor: t.neutral100 }]}
      >
        <Octicons name="arrow-left" size={24} color={t.textPrimary} />
      </Button>

      <ProgressBar progress={66} style={s.progressBar} />

      <TextField variant="title" style={[s.title, { color: t.textPrimary }]}>
        Detalles Personales
      </TextField>
      <TextField
        variant="caption"
        style={[s.subtitle, { color: t.textSecondary }]}
      >
        (Paso 2 de 3)
      </TextField>

      <Controller
        control={control}
        name="fechaNacimiento"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormField
            label="Fecha de nacimiento"
            placeholder="DD/MM/AAAA"
            value={value}
            onBlur={onBlur}
            onChangeText={text => {
              const formatted = formatDateInput(text);
              onChange(formatted);
            }}
            keyboardType="numeric"
            maxLength={10}
            leftIcon={
              <Octicons name="calendar" size={20} color={t.textSecondary} />
            }
            helperText={errors.fechaNacimiento?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="genero"
        render={({ field: { onChange, value } }) => (
          <GenderForm
            value={value}
            onChange={onChange}
            errorMessage={errors.genero?.message}
            list={GENDER}
          />
        )}
      />

      <Button
        title="Siguiente"
        onPress={handleSubmit(onSubmit)}
        variant="primary"
        style={s.button}
      />
    </View>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 64 },
  backButton: {
    position: 'absolute',
    top: 64,
    left: 24,
    zIndex: 10,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  progressBar: { marginBottom: 40, maxWidth: 200, alignSelf: 'center' },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 32 },
  button: { marginTop: 16 },
});

export default RegisterStep2;
