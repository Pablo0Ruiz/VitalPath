import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import Octicons from '@expo/vector-icons/Octicons';

import { useSeniorUIStore } from '@/src/stores/seniorUI.store';
import { useTheme } from '@/src/hooks/useTheme';
import { Button, TextField } from '@/src/components/ui/atoms';
import { AuthHeader } from '@/src/components/ui/molecules';
import { AuthLayout } from '@/src/components/ui/organisms';
import { ROUTES } from '@/src/routes/routes';
import { useUpdateUser } from '@repo/api-client';
import { useAuthStore } from '@/src/stores/auth';

const SeniorUISuggestionScreen = () => {
  const t = useTheme();
  const { setSession } = useAuthStore();
  const {
    hasSeenSuggestion,
    _hasHydrated,
    setIsSeniorUI,
    setHasSeenSuggestion,
  } = useSeniorUIStore();

  const { mutateAsync: updateUser } = useUpdateUser({
    onSuccess: user => {
      setSession(user);
    },
  });

  useEffect(() => {
    if (_hasHydrated && hasSeenSuggestion) {
      router.replace(ROUTES.HOME);
    }
  }, [_hasHydrated, hasSeenSuggestion]);

  if (!_hasHydrated || hasSeenSuggestion) return null;

  const handleActivate = async () => {
    try {
      await updateUser({ seniorMode: true });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSeniorUI(true);
      setHasSeenSuggestion();
      router.replace(ROUTES.HOME);
    }
  };

  const handleDecline = async () => {
    try {
      await updateUser({ seniorMode: false });
    } catch (error) {
      console.error(error);
    } finally {
      setHasSeenSuggestion();
      router.replace(ROUTES.HOME);
    }
  };

  return (
    <AuthLayout
      heroContent={
        <AuthHeader title="Modo Senior" subtitle="Diseñado para vos" />
      }
      noCard={true}
    >
      <View style={s.content}>
        <Octicons name="heart" size={96} color={t.primary600} style={s.icon} />

        <TextField variant="title" style={[s.title, { color: t.textPrimary }]}>
          Tenemos algo especial para vos
        </TextField>

        <TextField variant="body" style={[s.body, { color: t.textSecondary }]}>
          El Modo Senior activa letras más grandes, botones de fácil toque y
          mejor contraste en toda la app.
        </TextField>

        <Button
          title="Activar Modo Senior"
          onPress={handleActivate}
          variant="primary"
          style={[s.button, { minHeight: t.minTouchTarget }]}
        />

        <Button
          title="No por ahora"
          onPress={handleDecline}
          variant="outline"
          style={[s.button, { minHeight: t.minTouchTarget }]}
        />
      </View>
    </AuthLayout>
  );
};

const s = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  body: {
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    width: '100%',
    marginBottom: 16,
  },
});

export default SeniorUISuggestionScreen;
