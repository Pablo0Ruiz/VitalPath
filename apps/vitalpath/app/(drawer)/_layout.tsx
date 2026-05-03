import { Drawer } from 'expo-router/drawer';
import { AppDrawerContent } from '@/src/components/ui/organism';
import { useTheme } from '@/src/hooks/useTheme';
import { DRAWER_SCREEN_NAMES } from '@/src/routes/routes';

export default function DrawerLayout() {
  const t = useTheme();
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
    </Drawer>
  );
}
