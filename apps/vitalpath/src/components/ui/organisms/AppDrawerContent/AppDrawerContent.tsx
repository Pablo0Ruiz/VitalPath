import { Alert, Pressable, StyleSheet, View } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/src/stores/auth';
import { useLogout } from '@repo/api-client';
import { mobileTokenAdapter } from '@/src/adapters/mobileTokenAdapter';
import { ROUTES } from '@/src/routes/routes';
import { TextField, UserAvatar } from '@/src/components/ui/atoms';
import { useTheme } from '@/src/hooks/useTheme';

export default function AppDrawerContent(props: DrawerContentComponentProps) {
  const t = useTheme();
  const { user, clearSession } = useAuthStore();
  const { logout } = useLogout(
    mobileTokenAdapter,
    { clearSession },
    { loginRoute: ROUTES.LOGIN },
  );

  const navigateAndClose = (route: string) => {
    router.push(route as never);
    props.navigation.closeDrawer();
  };

  const handleLogout = () => {
    Alert.alert('Sesión', '¿Cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={s.scrollContent}>
      <View style={s.headerSection}>
        <UserAvatar size="lg" name={user?.name} />
        <View style={s.headerText}>
          <TextField variant="body" style={{ color: t.textPrimary }}>
            {user?.name}
          </TextField>
          <TextField variant="caption" style={{ color: t.textSecondary }}>
            {user?.email}
          </TextField>
        </View>
      </View>

      <View style={[s.separator, { backgroundColor: t.border }]} />

      <View>
        <Pressable
          onPress={() => navigateAndClose(ROUTES.PROFILE)}
          style={[s.navItem, { height: t.minTouchTarget }]}
        >
          <Ionicons name="person-outline" size={20} color={t.textPrimary} />
          <TextField variant="body" style={s.navLabel}>
            Mi Perfil
          </TextField>
        </Pressable>
        <Pressable
          onPress={() => navigateAndClose(ROUTES.SETTINGS)}
          style={[s.navItem, { height: t.minTouchTarget }]}
        >
          <Ionicons name="settings-outline" size={20} color={t.textPrimary} />
          <TextField variant="body" style={s.navLabel}>
            Configuración
          </TextField>
        </Pressable>
      </View>

      <View style={s.footer}>
        <Pressable
          onPress={handleLogout}
          style={[s.footerItem, { height: t.minTouchTarget }]}
        >
          <Ionicons name="log-out-outline" size={20} color={t.error} />
          <TextField variant="body" style={[s.navLabel, { color: t.error }]}>
            Cerrar sesión
          </TextField>
        </Pressable>
      </View>
    </DrawerContentScrollView>
  );
}

const s = StyleSheet.create({
  scrollContent: { flex: 1 },
  headerSection: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  headerText: { marginLeft: 12 },
  separator: { height: 1, marginVertical: 8 },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  navLabel: { marginLeft: 12 },
  footer: { marginTop: 'auto', paddingBottom: 32 },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});
