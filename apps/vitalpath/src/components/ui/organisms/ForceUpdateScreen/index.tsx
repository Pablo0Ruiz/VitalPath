import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/src/hooks/useTheme';

export function ForceUpdateScreen() {
  const t = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.background }]}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: t.primary100 }]}>
          <Text style={[styles.icon, { color: t.primary600 }]}>🔒</Text>
        </View>

        <Text style={[styles.title, { color: t.textPrimary }]}>
          Actualización requerida
        </Text>

        <Text style={[styles.message, { color: t.textSecondary }]}>
          Para continuar debe actualizar la versión del apk.
        </Text>

        <View style={[styles.divider, { backgroundColor: t.border }]} />

        <Text style={[styles.hint, { color: t.textSecondary }]}>
          Solicitá la versión actualizada a tu administrador.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 36,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_18pt-Regular',
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    fontFamily: 'Inter_18pt-Light',
    textAlign: 'center',
    lineHeight: 24,
  },
  divider: {
    width: '100%',
    height: 1,
    marginVertical: 8,
  },
  hint: {
    fontSize: 13,
    fontFamily: 'Inter_18pt-Light',
    textAlign: 'center',
    opacity: 0.7,
  },
});
