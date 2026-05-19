import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Octicons from '@expo/vector-icons/Octicons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { router } from 'expo-router';

import {
  BackButton,
  Button,
  Card,
  ScreenHeader,
  TextField,
} from '@/src/components/ui/atoms';
import { FormField, GenderForm } from '@/src/components/ui/molecules';
import { useTheme } from '@/src/hooks/useTheme';
import { useVincular } from '@repo/api-client';
import {
  vincularSchema,
  type TipoVinculo,
  type VincularFormValues,
} from '@repo/types';
import { z } from 'zod';

const TIPO_OPCIONES: { value: TipoVinculo; label: string }[] = [
  { value: 'HIJO_A', label: 'Hijo/a' },
  { value: 'ESPOSO_A', label: 'Esposo/a' },
  { value: 'CUIDADOR_CONTRATADO', label: 'Cuidador contratado' },
  { value: 'OTRO', label: 'Otro' },
];

const TIPO_LABELS = TIPO_OPCIONES.map(o => o.label);

export default function VincularScreen() {
  const t = useTheme();
  const { mutate: vincular, isPending } = useVincular();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<VincularFormValues>({
    resolver: zodResolver(vincularSchema),
    defaultValues: { codigo: '', tipo_vinculo: undefined },
  });

  const tipoVinculoValue = watch('tipo_vinculo');

  const onSubmit = (data: VincularFormValues) => {
    vincular(
      { codigo: data.codigo, tipo_vinculo: data.tipo_vinculo },
      {
        onSuccess: () => {
          Alert.alert(
            '¡Vinculación exitosa!',
            'Ya podés ver las citas de tu familiar.',
            [{ text: 'OK', onPress: () => router.back() }],
          );
        },
        onError: (err: any) => {
          const code = err?.response?.data?.error;
          const messages: Record<string, string> = {
            CODE_EXPIRED: 'El código expiró. Pedí uno nuevo a tu familiar.',
            CODE_ALREADY_USED: 'Este código ya fue utilizado.',
            ALREADY_LINKED: 'Ya estás vinculado con este paciente.',
          };
          Alert.alert(
            'Error',
            messages[code] ?? 'Código inválido o no encontrado.',
          );
        },
      },
    );
  };

  return (
    <SafeAreaView
      style={[s.container, { backgroundColor: t.background }]}
      edges={['top']}
    >
      <BackButton />
      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ScreenHeader
          title="Vincular paciente"
          subtitle="Ingresá el código que te dio tu familiar"
        />

        <Card style={s.infoCard}>
          <TextField
            variant="caption"
            style={{ color: t.textSecondary, textAlign: 'center' }}
          >
            El paciente genera el código desde la sección{' '}
            <TextField
              variant="caption"
              style={{ color: t.primary600, fontWeight: '700' }}
            >
              Mis Cuidadores
            </TextField>
            . Es válido por 15 minutos.
          </TextField>
        </Card>

        <View style={s.form}>
          <Controller
            control={control}
            name="codigo"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormField
                label="Código de 6 dígitos"
                placeholder="000000"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                keyboardType="numeric"
                maxLength={6}
                autoCorrect={false}
                autoCapitalize="none"
                inputStyle={s.codeInput}
                leftIcon={
                  <Octicons name="number" size={20} color={t.textSecondary} />
                }
                helperText={errors.codigo?.message}
              />
            )}
          />

          <GenderForm
            title="Tipo de vínculo"
            list={TIPO_LABELS}
            value={
              tipoVinculoValue
                ? (TIPO_OPCIONES.find(o => o.value === tipoVinculoValue)
                    ?.label ?? '')
                : ''
            }
            onChange={label => {
              const found = TIPO_OPCIONES.find(o => o.label === label);
              if (found)
                setValue('tipo_vinculo', found.value, { shouldValidate: true });
            }}
            errorMessage={errors.tipo_vinculo?.message}
          />

          <Button
            title="Vincular"
            variant="primary"
            loading={isPending}
            onPress={handleSubmit(onSubmit)}
            style={s.submitButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 48 },
  infoCard: { marginHorizontal: 20, marginBottom: 8 },
  form: { paddingHorizontal: 20, paddingTop: 8 },
  codeInput: { fontSize: 28, letterSpacing: 8, textAlign: 'center' },
  submitButton: { marginTop: 8 },
});
