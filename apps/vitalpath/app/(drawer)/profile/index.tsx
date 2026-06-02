import { Alert, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  BackButton,
  Button,
  ScreenHeader,
  UserAvatar,
} from '@/src/components/ui/atoms';
import { SettingsRow } from '@/src/components/ui/molecules';
import { ScreenLayout } from '@/src/components/ui/organisms';
import { useAuthStore } from '@/src/stores/auth';
import { useLogout } from '@repo/api-client';
import { mobileTokenAdapter } from '@/src/adapters/mobileTokenAdapter';
import { ROUTES } from '@/src/routes/routes';
import { useTheme } from '@/src/hooks/useTheme';

export default function ProfileScreen() {
  const t = useTheme();
  const { user, clearSession } = useAuthStore();
  const { logout } = useLogout(
    mobileTokenAdapter,
    { clearSession },
    { loginRoute: ROUTES.LOGIN },
  );

  const handleLogout = () => {
    Alert.alert('Sesión', '¿Cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: logout },
    ]);
  };

  const rows = [
    { label: 'Nombre', value: user?.name ?? '—' },
    { label: 'Email', value: user?.email ?? '—' },
    { label: 'Rol', value: user?.role ?? '—' },
    ...(user?.fechaNacimiento
      ? [
          {
            label: 'Fecha de nacimiento',
            value: user.fechaNacimiento.split('T')[0],
          },
        ]
      : []),
    ...(user?.genero ? [{ label: 'Género', value: user.genero }] : []),
  ];

  return (
    <ScreenLayout scrollable={true}>
      <BackButton />
      <ScreenHeader title="Mi Perfil" subtitle="Información de tu cuenta" />
      <View style={s.avatarContainer}>
        <LinearGradient
          testID="avatar-gradient-ring"
          colors={[t.accentAi, t.primary600]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.gradientRing}
        >
          <UserAvatar size="lg" name={user?.name} showStatus />
        </LinearGradient>
      </View>
      <View style={s.card}>
        {rows.map((row, i) => (
          <SettingsRow
            key={row.label}
            label={row.label}
            value={row.value}
            noBorder={i === rows.length - 1}
          />
        ))}
      </View>
      <Button
        title="Cerrar sesión"
        variant="outline"
        onPress={handleLogout}
        style={s.logoutButton}
      />
    </ScreenLayout>
  );
}

const s = StyleSheet.create({
  avatarContainer: { alignItems: 'center', paddingVertical: 24 },
  gradientRing: {
    padding: 3,
    borderRadius: 999,
  },
  card: { borderRadius: 16, overflow: 'hidden', marginBottom: 8 },
  logoutButton: { marginTop: 24 },
});
