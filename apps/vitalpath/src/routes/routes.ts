interface RouteConfig {
  title: string;
  icon: string;
  screenName: string;
}

export const ROUTES = {
  LOGIN: '/(auth)/login',
  REGISTER: '/(auth)/register',
  REGISTER_STEP_2: '/(auth)/register/step-2',
  REGISTER_STEP_3: '/(auth)/register/step-3',
  RECOVER_PASSWORD: '/(auth)/recover-password',
  HOME: '/(tabs)/home',
  RECOVER_PASSWORD_EMAIL_SENT: '/(auth)/recover-password-email-sent',
  RECORDS: '/(tabs)/records',
  MEDICAL_RESULTS: '/(tabs)/records/[id]',
  APPOINTMENTS: '/(tabs)/appointments',
  CHAT: '/(tabs)/chat',
  MEDICATIONS: '/(tabs)/medications',
  SENIOR_UI_SUGGESTION: '/(auth)/senior-ui-suggestion',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

export const DRAWER_SCREEN_NAMES = {
  TABS: '(tabs)',
  PROFILE: 'profile',
  SETTINGS: 'settings',
} as const;

export const AUTH_SCREEN_NAMES = {
  LOGIN: 'login/index',
  REGISTER: 'register',
  RECOVER_PASSWORD: 'recover-password/index',
  RECOVER_PASSWORD_EMAIL_SENT: 'recover-password-email-sent/index',
  REGISTER_STEP_2: 'register/step-2',
  REGISTER_STEP_3: 'register/step-3',
} as const;

export const REGISTER_SCREEN_NAMES = {
  INDEX: 'index',
  STEP_2: 'step-2',
  STEP_3: 'step-3',
} as const;

export const TAB_SCREEN_NAMES = {
  HOME: 'home/index',
  CHAT: 'chat/index',
  RECORDS: 'records',
  APPOINTMENTS: 'appointments/index',
} as const;

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

export const AUTH_REGISTER_ROUTES: RouteConfig[] = [
  {
    title: 'Registrarse Step 2',
    icon: 'person',
    screenName: REGISTER_SCREEN_NAMES.STEP_2,
  },
  {
    title: 'Registrarse Step 3',
    icon: 'person',
    screenName: REGISTER_SCREEN_NAMES.STEP_3,
  },
];

export const TAB_ROUTES: RouteConfig[] = [
  {
    title: 'Records',
    icon: 'NoteIcon',
    screenName: TAB_SCREEN_NAMES.RECORDS,
  },
  {
    title: 'Home',
    icon: 'Home01Icon',
    screenName: TAB_SCREEN_NAMES.HOME,
  },
  {
    title: 'Chat',
    icon: 'BubbleChatIcon',
    screenName: TAB_SCREEN_NAMES.CHAT,
  },
  {
    title: 'Citas',
    icon: 'Calendar03Icon',
    screenName: TAB_SCREEN_NAMES.APPOINTMENTS,
  },
];
