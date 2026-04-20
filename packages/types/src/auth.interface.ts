export interface UserSession {
  id: string;
  name: string;
  lastName?: string;
  email: string;
  role?: string;
  medicaments?: string[];
}

export interface TokenAdapter {
  getToken: () => Promise<string | null>;
  setToken: (token: string) => Promise<void>;
  deleteToken: () => Promise<void>;
  navigate: (route: string) => void;
}

export type UserCredentials = {
  token: string;
  user: UserSession;
};

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  lastName: string;
  email: string;
  password: string;
  fechaNacimiento: string;
  genero: 'Masculino' | 'Femenino' | 'Otro';
}
