import { Drawer } from 'expo-router/drawer';
import { AppDrawerContent } from '@/src/components/ui/organisms';
import { useTheme } from '@/src/hooks/useTheme';
import { DRAWER_SCREEN_NAMES } from '@/src/routes/routes';
import { useActivePacienteRevalidator } from '@/src/hooks/useActivePacienteRevalidator';

export default function DrawerLayout() {
  const t = useTheme();
  useActivePacienteRevalidator();
  return (
    <Drawer
      drawerContent={props => <AppDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerPosition: 'right',
        swipeEnabled: false,
        overlayColor: 'rgba(0,0,0,0.4)',
        drawerStyle: { width: '80%', backgroundColor: t.surface },
      }}
    >
      <Drawer.Screen
        name={DRAWER_SCREEN_NAMES.TABS}
        options={{ drawerItemStyle: { display: 'none' } }}
      />
      <Drawer.Screen
        name={DRAWER_SCREEN_NAMES.PROFILE}
        options={{ drawerItemStyle: { display: 'none' }, title: 'Mi Perfil' }}
      />
      <Drawer.Screen
        name={DRAWER_SCREEN_NAMES.SETTINGS}
        options={{
          drawerItemStyle: { display: 'none' },
          title: 'Configuración',
        }}
      />
      <Drawer.Screen
        name={DRAWER_SCREEN_NAMES.CUIDADORES}
        options={{
          drawerItemStyle: { display: 'none' },
          title: 'Mis Cuidadores',
        }}
      />
      <Drawer.Screen
        name={DRAWER_SCREEN_NAMES.PACIENTES}
        options={{
          drawerItemStyle: { display: 'none' },
          title: 'Mis Pacientes',
        }}
      />
      <Drawer.Screen
        name={DRAWER_SCREEN_NAMES.VINCULAR}
        options={{
          drawerItemStyle: { display: 'none' },
          title: 'Vincular Paciente',
        }}
      />
    </Drawer>
  );
}
