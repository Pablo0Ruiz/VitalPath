import { Href, router } from 'expo-router';
import { Alert, Image, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { Button, TextField } from '@/src/components/ui/atoms';
import { Divider, FormField } from '@/src/components/ui/molecules';
import { useLogin, useLoginWithCode } from '@repo/api-client';
import { useAuthStore } from '@/src/stores/auth';
import { mobileTokenAdapter } from '@/src/adapters/mobileTokenAdapter';
import {
  LoginFormValues,
  loginSchema,
  CodigoFormValues,
  codigoSchema,
} from '@repo/types';
import { ROUTES } from '@/src/routes/routes';
import { useTheme } from '@/src/hooks/useTheme';
import { useSeniorUIStore } from '@/src/stores/seniorUI.store';
import { isElderlyUser } from '@/src/utils/date';

const Login = () => {
  const t = useTheme();
  const { setSession } = useAuthStore();
  const { hasSeenSuggestion } = useSeniorUIStore();

  const { mutate: login, isPending } = useLogin(
    mobileTokenAdapter,
    { setSession },
    { successRoute: ROUTES.HOME },
  );

  const { mutate: loginWithCode, isPending: isPendingCode } = useLoginWithCode(
    mobileTokenAdapter,
    {
      setSession,
      afterSuccess: user => {
        const isElderly = isElderlyUser(user.fechaNacimiento);
        if (isElderly && !hasSeenSuggestion) {
          router.replace(ROUTES.SENIOR_UI_SUGGESTION as Href);
        } else {
          router.replace(ROUTES.HOME as Href);
        }
      },
    },
  );

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

  const {
    control: codeControl,
    handleSubmit: handleCodeSubmit,
    formState: { errors: codeErrors },
  } = useForm<CodigoFormValues>({
    resolver: zodResolver(codigoSchema),
    defaultValues: { codigo: '' },
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data, {
      onError: () => {
        Alert.alert('Error', 'Credenciales incorrectas');
      },
    });
  };

  const onCodeSubmit = (data: CodigoFormValues) => {
    loginWithCode(data.codigo, {
      onError: () => {
        Alert.alert('Error', 'Código incorrecto');
      },
    });
  };

  return (
    <SafeAreaView style={[s.container, { backgroundColor: t.background }]}>
      <ScrollView
        style={s.flex1}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.heroSection}>
          <View style={[s.logoWrapper, { backgroundColor: t.primary600 }]}>
            <Image
              source={require('@/assets/images/new-logo.png')}
              style={s.logo}
              resizeMode="contain"
            />
          </View>
          <TextField
            variant="title"
            style={[s.heroTitle, { color: t.textPrimary }]}
          >
            VitalPath
          </TextField>
          <TextField
            variant="caption"
            style={[s.heroSubtitle, { color: t.textSecondary }]}
          >
            Tu salud, guiada con inteligencia
          </TextField>
        </View>

        <View style={s.formSection}>
          <TextField
            variant="body"
            style={[s.formTitle, { color: t.textPrimary }]}
          >
            Iniciar sesión
          </TextField>
          <TextField
            variant="caption"
            style={[s.formSubtitle, { color: t.textSecondary }]}
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
                style={s.passwordField}
                helperText={errors.password?.message}
              />
            )}
          />

          <Button
            title="Iniciar sesión"
            variant="primary"
            style={s.loginButton}
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting || isPending}
            disabled={isSubmitting || isPending}
          />

          <Divider text="o ingresá tu código de acceso" style={s.divider} />

          <Controller
            control={codeControl}
            name="codigo"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormField
                label="Código de acceso senior"
                placeholder="000000"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                keyboardType="numeric"
                maxLength={6}
                autoCorrect={false}
                autoCapitalize="none"
                style={s.codeField}
                inputStyle={s.codeInput}
                helperText={codeErrors.codigo?.message}
              />
            )}
          />

          <Button
            title={isPendingCode ? 'Ingresando...' : 'Ingresar con código'}
            variant="outline"
            style={s.codeButton}
            onPress={handleCodeSubmit(onCodeSubmit)}
            loading={isPendingCode}
            disabled={isPendingCode}
          />

          <View style={s.footer}>
            <TextField
              variant="caption"
              style={[s.footerText, { color: t.textSecondary }]}
              onPress={() => router.push(ROUTES.REGISTER)}
            >
              ¿No tenés cuenta?{'  '}
              <TextField
                variant="caption"
                style={[s.linkText, { color: t.primary600 }]}
              >
                Registrate
              </TextField>
            </TextField>
            <TextField
              variant="caption"
              style={[s.footerText, { color: t.textSecondary, marginTop: 8 }]}
              onPress={() => router.push(ROUTES.REGISTER_CUIDADOR as never)}
            >
              ¿Sos cuidador familiar?{'  '}
              <TextField
                variant="caption"
                style={[s.linkText, { color: t.primary600 }]}
              >
                Registrate acá
              </TextField>
            </TextField>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  container: { flex: 1 },
  flex1: { flex: 1 },
  scrollContent: { paddingBottom: 48 },
  heroSection: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  logoWrapper: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logo: { width: 40, height: 40 },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  heroSubtitle: { fontSize: 14, textAlign: 'center' },
  formSection: { paddingHorizontal: 24 },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'left',
    marginBottom: 4,
  },
  formSubtitle: { fontSize: 14, textAlign: 'left', marginBottom: 24 },
  passwordField: { marginBottom: 24 },
  loginButton: { marginBottom: 16 },
  divider: { marginBottom: 16 },
  codeField: { marginBottom: 12 },
  codeInput: {
    fontSize: 28,
    letterSpacing: 8,
    textAlign: 'center',
    minHeight: 56,
  },
  codeButton: { marginBottom: 16 },
  footer: { alignItems: 'center', marginTop: 8 },
  footerText: { fontSize: 14, textAlign: 'center' },
  linkText: { fontWeight: '700' },
});

export default Login;
