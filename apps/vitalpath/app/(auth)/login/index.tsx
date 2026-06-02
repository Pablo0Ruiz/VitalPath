import { router } from 'expo-router';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import Octicons from '@expo/vector-icons/Octicons';
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
import { useState } from 'react';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const HERO_GRADIENT: [string, string] = ['#4f6ef7', '#14B8A6'];

const Login = () => {
  const t = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showCodeSection, setShowCodeSection] = useState(false);
  const { setSession } = useAuthStore();
  const { hasSeenSuggestion } = useSeniorUIStore();

  const { mutate: login, isPending } = useLogin(
    mobileTokenAdapter,
    {
      setSession,
      onRoleError: (title, message) => Alert.alert(title, message),
    },
    { successRoute: ROUTES.HOME },
  );

  const { mutate: loginWithCode, isPending: isPendingCode } = useLoginWithCode(
    mobileTokenAdapter,
    {
      setSession,
      afterSuccess: user => {
        const isElderly = isElderlyUser(user.fechaNacimiento);
        if (isElderly && !hasSeenSuggestion) {
          router.replace(ROUTES.SENIOR_UI_SUGGESTION);
        } else {
          router.replace(ROUTES.HOME);
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

  const handleToggleCodeSection = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowCodeSection(v => !v);
  };

  return (
    <SafeAreaView style={[s.container, { backgroundColor: t.background }]}>
      <KeyboardAvoidingView
        style={s.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={s.keyboardView}
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <LinearGradient
            colors={HERO_GRADIENT}
            start={{ x: 0.3, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.hero}
          >
            <View style={s.logoCircle}>
              <Image
                source={require('@/assets/images/new-logo.png')}
                style={s.logo}
                resizeMode="contain"
              />
            </View>

            <TextField
              variant="title"
              style={[
                s.brandName,
                {
                  color: '#FFFFFF',
                  fontSize: t.fontSizeDisplay,
                  fontFamily: 'PlusJakartaSans-VariableFont_wght',
                  fontWeight: '700',
                },
              ]}
            >
              VitalPath
            </TextField>

            <TextField
              variant="caption"
              style={[
                s.tagline,
                {
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: t.fontSizeCaption,
                },
              ]}
            >
              Tu salud, guiada con inteligencia
            </TextField>

            <View style={s.trustRow}>
              <View style={s.trustChip}>
                <Octicons name="shield-lock" size={12} color="#FFFFFF" />
                <TextField variant="caption" style={s.trustChipText}>
                  Tus datos, protegidos
                </TextField>
              </View>
              <View style={s.trustChip}>
                <Octicons name="verified" size={12} color="#FFFFFF" />
                <TextField variant="caption" style={s.trustChipText}>
                  Uso médico verificado
                </TextField>
              </View>
            </View>
          </LinearGradient>
          <View
            style={[
              s.card,
              {
                backgroundColor: t.surface,
                borderTopLeftRadius: t.radiusSheet,
                borderTopRightRadius: t.radiusSheet,
              },
            ]}
          >
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
                  rightLabel="¿Olvidaste tu contraseña?"
                  onChangeText={onChange}
                  secureTextEntry={!showPassword}
                  onBlur={onBlur}
                  value={value}
                  rightLabelOnPress={() => router.push(ROUTES.RECOVER_PASSWORD)}
                  style={s.passwordField}
                  rightIcon={
                    <Button
                      variant="ghost"
                      size="sm"
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Octicons
                        name={showPassword ? 'eye' : 'eye-closed'}
                        size={20}
                        color={t.textSecondary}
                      />
                    </Button>
                  }
                  helperText={errors.password?.message}
                />
              )}
            />

            <Button
              title="Iniciar sesión"
              variant="primary"
              style={s.primaryButton}
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting || isPending}
              disabled={isSubmitting || isPending}
            />

            <TouchableOpacity
              style={[s.toggleButton, { minHeight: t.minTouchTarget }]}
              onPress={handleToggleCodeSection}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="Mostrar o esconder código de acceso senior"
            >
              <TextField
                variant="caption"
                style={[
                  s.toggleText,
                  { color: t.textSecondary, fontSize: t.fontSizeBody },
                ]}
              >
                ¿Usás código de acceso?
              </TextField>
            </TouchableOpacity>

            {showCodeSection && (
              <View style={s.codeSection}>
                <Divider
                  text="o ingresá tu código de acceso"
                  style={s.divider}
                />

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
                      inputStyle={[s.codeInput, { fontSize: t.fontSizeTitle }]}
                      helperText={codeErrors.codigo?.message}
                    />
                  )}
                />

                <Button
                  title={
                    isPendingCode ? 'Ingresando...' : 'Ingresar con código'
                  }
                  variant="outline"
                  style={s.codeButton}
                  onPress={handleCodeSubmit(onCodeSubmit)}
                  loading={isPendingCode}
                  disabled={isPendingCode}
                />
              </View>
            )}

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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 48 },
  hero: {
    alignItems: 'center',
    paddingTop: 56,
    paddingBottom: 64,
    paddingHorizontal: 24,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  logo: { width: 64, height: 64 },
  brandName: {
    textAlign: 'center',
    marginBottom: 6,
  },
  tagline: {
    textAlign: 'center',
    marginBottom: 20,
  },
  trustRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  trustChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  trustChipText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  card: {
    marginTop: -32,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 32,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  passwordField: { marginBottom: 24 },
  primaryButton: { marginBottom: 8 },
  toggleButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    marginBottom: 8,
  },
  toggleText: {
    textAlign: 'center',
  },
  codeSection: {},
  divider: { marginBottom: 16 },
  codeField: { marginBottom: 12 },
  codeInput: {
    letterSpacing: 8,
    textAlign: 'center',
    minHeight: 56,
  },
  codeButton: { marginBottom: 16 },
  footer: { alignItems: 'center', marginTop: 8 },
  footerText: { textAlign: 'center' },
  linkText: { fontWeight: '700' },
});

export default Login;
