import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useSeniorUIStore } from '@/src/stores/seniorUI.store';
import { useTheme } from '@/src/hooks/useTheme';
import { Button } from '@/src/components/ui/atoms';
import { ROUTES } from '@/src/routes/routes';
import { useUpdateUser } from '@repo/api-client';
import { useAuthStore } from '@repo/store';

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
    } finally {
      setHasSeenSuggestion();
      router.replace(ROUTES.HOME);
    }
  };

  return (
    <View style={[s.container, { backgroundColor: t.surface }]}>
      <View style={s.content}>
        <Ionicons name="heart-circle" size={96} color={t.primary600} />

        <Text
          style={[
            s.title,
            {
              color: t.textPrimary,
              fontSize: t.fontSizeTitle,
              lineHeight: t.fontSizeTitle * 1.2,
            },
          ]}
        >
          Tenemos algo especial para vos
        </Text>

        <Text
          style={[
            s.body,
            {
              color: t.textSecondary,
              fontSize: t.fontSizeBody,
              lineHeight: t.fontSizeBody * 1.5,
            },
          ]}
        >
          El Modo Senior activa letras más grandes, botones de fácil toque y
          mejor contraste en toda la app.
        </Text>

        <Button
          title="Activar Modo Senior"
          onPress={handleActivate}
          variant="primary"
          style={s.primaryButton}
        />

        <Button
          title="No por ahora"
          onPress={handleDecline}
          variant="outline"
          style={s.secondaryButton}
        />
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  content: {
    alignItems: 'center',
    gap: 0,
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  body: {
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 40,
  },
  primaryButton: {
    width: '100%',
    minHeight: 56,
    marginBottom: 16,
  },
  secondaryButton: {
    width: '100%',
    minHeight: 56,
  },
});

export default SeniorUISuggestionScreen;
