export const ROUTES = {
  LOGIN: '/(auth)/login',
  REGISTER: '/(auth)/register',
  RECOVER_PASSWORD: '/(auth)/recover-password',
  HOME: '/(tabs)/home',
  PROFILE: '/(tabs)/profile',
  SETTINGS: '/(tabs)/settings',
} as const;

export type AppRouteName = (typeof ROUTES)[keyof typeof ROUTES];

export const AUTH_SCREEN_NAMES = {
  LOGIN: 'login/index',
  REGISTER: 'register/index',
  RECOVER_PASSWORD: 'recover-password/index',
} as const;

interface RouteConfig {
  title: string;
  icon: React.ReactNode;
  screenName: string;
}

//TODO: Cambiar los iconos
export const AUTH_ROUTES: RouteConfig[] = [
  {
    title: 'Iniciar Sesión',
    icon: 'person',
    screenName: AUTH_SCREEN_NAMES.LOGIN,
  },
  {
    title: 'Registrarse',
    icon: 'person',
    screenName: AUTH_SCREEN_NAMES.REGISTER,
  },
  {
    title: 'Recuperar Contraseña',
    icon: 'person',
    screenName: AUTH_SCREEN_NAMES.RECOVER_PASSWORD,
  },
];

export const TAB_ROUTES: RouteConfig[] = [
  {
    title: 'Profile',
    icon: 'person',
    screenName: 'profile',
  },
  {
    title: 'Settings',
    icon: 'settings',
    screenName: 'settings',
  },
];
