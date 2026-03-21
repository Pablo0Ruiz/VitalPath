import { Octicons } from '@expo/vector-icons';

export const ROUTES = {
  LOGIN: '/(auth)/login',
  REGISTER: '/(auth)/register',
  RECOVER_PASSWORD: '/(auth)/recover-password',
  HOME: '/(tabs)/home',
  PROFILE: '/(tabs)/profile',
  SETTINGS: '/(tabs)/settings',
} as const;

export const AUTH_SCREEN_NAMES = {
  LOGIN: 'login/index',
  REGISTER: 'register/index',
  RECOVER_PASSWORD: 'recover-password/index',
} as const;

export const TAB_SCREEN_NAMES = {
  HOME: 'home/index',
  PROFILE: 'profile/index',
  SETTINGS: 'settings/index',
  CHAT: 'chat/index',
} as const;

interface RouteConfig {
  title: string;
  icon: keyof typeof Octicons.glyphMap;
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
  // {
  //   title: 'Profile',
  //   icon: 'person',
  //   screenName: TAB_SCREEN_NAMES.PROFILE,
  // },
  // {
  //   title: 'Settings',
  //   icon: 'settings',
  //   screenName: TAB_SCREEN_NAMES.SETTINGS,
  // },
  {
    title: 'Home',
    icon: 'home',
    screenName: TAB_SCREEN_NAMES.HOME,
  },
  {
    title: 'Chat',
    icon: 'comment',
    screenName: TAB_SCREEN_NAMES.CHAT,
  },
];
