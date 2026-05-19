export interface UserSession {
  _id: string;
  name: string;
  lastName?: string;
  email: string;
  role?: string;
  medicaments?: string[];
  fechaNacimiento?: string;
  genero?: string;
  seniorMode?: boolean;
}

export interface TokenAdapter {
  getToken: () => Promise<string | null>;
  setToken: (token: string) => Promise<void>;
  deleteToken: () => Promise<void>;
  getRefreshToken: () => Promise<string | null>;
  setRefreshToken: (token: string) => Promise<void>;
  deleteRefreshToken: () => Promise<void>;
  navigate: (route: string) => void;
}

export type UserCredentials = {
  accessToken: string;
  token?: string;
  refreshToken?: string;
  user: UserSession;
};

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCuidadorCredentials {
  name: string;
  lastName: string;
  email: string;
  password: string;
  fechaNacimiento: string;
  genero: 'Masculino' | 'Femenino' | 'Otro';
  role: 'CUIDADOR_FAMILIAR';
}

export interface RegisterCredentials {
  name: string;
  lastName: string;
  email: string;
  password: string;
  fechaNacimiento: string;
  genero: 'Masculino' | 'Femenino' | 'Otro';
}
