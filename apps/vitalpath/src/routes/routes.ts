import { Octicons } from '@expo/vector-icons';

export const ROUTES = {
  LOGIN: '/(auth)/login',
  REGISTER: '/(auth)/register',
  REGISTER_STEP_2: '/(auth)/register/step-2',
  REGISTER_STEP_3: '/(auth)/register/step-3',
  RECOVER_PASSWORD: '/(auth)/recover-password',
  HOME: '/(tabs)/home',
  PROFILE: '/(tabs)/profile',
  SETTINGS: '/(tabs)/settings',
  RECOVER_PASSWORD_EMAIL_SENT: '/(auth)/recover-password-email-sent',
  RECORDS: '/(tabs)/records',
} as const;

export const AUTH_SCREEN_NAMES = {
  LOGIN: 'login/index',
  REGISTER: 'register/index',
  REGISTER_STEP_2: 'register/step-2',
  REGISTER_STEP_3: 'register/step-3',
  RECOVER_PASSWORD: 'recover-password/index',
  RECOVER_PASSWORD_EMAIL_SENT: 'recover-password-email-sent/index',
} as const;

export const TAB_SCREEN_NAMES = {
  HOME: 'home/index',
  PROFILE: 'profile/index',
  SETTINGS: 'settings/index',
  CHAT: 'chat/index',
  RECORDS: 'records/index',
  APPOINTMENTS: 'appointments/index',
} as const;

interface RouteConfig {
  title: string;
  icon: keyof typeof Octicons.glyphMap;
  screenName: string;
}

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
  {
    title: 'Recuperar Contraseña Email Sent',
    icon: 'person',
    screenName: AUTH_SCREEN_NAMES.RECOVER_PASSWORD_EMAIL_SENT,
  },
];

export const TAB_ROUTES: RouteConfig[] = [
  // {
  //   title: 'Profile',
  //   icon: 'person',
  //   screenName: TAB_SCREEN_NAMES.PROFILE,
  // },
  {
    title: 'Records',
    icon: 'book',
    screenName: TAB_SCREEN_NAMES.RECORDS,
  },
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
  {
    title: 'Citas',
    icon: 'calendar',
    screenName: TAB_SCREEN_NAMES.APPOINTMENTS,
  },
];
