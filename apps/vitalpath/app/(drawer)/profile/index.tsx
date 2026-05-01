import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BackButton,
  Button,
  Card,
  ScreenHeader,
  TextField,
  UserAvatar,
} from '@/src/components/ui/atoms';
import { useAuthStore } from '@repo/store';
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
      ? [{ label: 'Fecha de nacimiento', value: user.fechaNacimiento }]
      : []),
    ...(user?.genero ? [{ label: 'Género', value: user.genero }] : []),
  ];

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: t.background }}
      edges={['top']}
    >
      <BackButton />
      <ScreenHeader title="Mi Perfil" subtitle="Información de tu cuenta" />
      <ScrollView contentContainerStyle={s.content}>
        <View style={s.avatarContainer}>
          <UserAvatar size="lg" name={user?.name} showStatus />
        </View>
        <Card>
          {rows.map((row, i) => (
            <View
              key={row.label}
              style={[
                s.row,
                i < rows.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: t.border,
                },
              ]}
            >
              <TextField variant="caption" style={{ color: t.textSecondary }}>
                {row.label}
              </TextField>
              <TextField
                variant="body"
                style={{ color: t.textPrimary, marginTop: 2 }}
              >
                {row.value}
              </TextField>
            </View>
          ))}
        </Card>
        <Button
          title="Cerrar sesión"
          variant="outline"
          onPress={handleLogout}
          style={s.logoutButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  avatarContainer: { alignItems: 'center', paddingVertical: 24 },
  row: { paddingHorizontal: 16, paddingVertical: 14 },
  logoutButton: { marginTop: 24 },
});
