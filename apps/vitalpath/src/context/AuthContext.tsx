import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import { myApi } from '../core/api/myApi';
import type { LoginFormValues } from '../interfaces/auth/login/login.interface';
import type { RegisterFormValues } from '../interfaces/auth/register/register.interface';
import { router } from 'expo-router';
import { ROUTES } from '../routes/routes';

const ACCESS_TOKEN_KEY = 'access_token';

interface UserContext {
  id: string;
  name: string;
  email: string;
}

type userCredentials = {
  token: string;
  user: UserContext;
};

interface AuthContextType {
  user: UserContext | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginFormValues) => Promise<boolean>;
  register: (data: RegisterFormValues) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSesion = async () => {
      try {
        const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
        if (token) {
          const { data } = await myApi.get<UserContext>('/api/user/me');
          setUser(data);
          router.push(ROUTES.HOME);
        }
      } catch (error) {
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
        setIsLoading(false);
      }
    };
    checkSesion();
  }, []);

  const login = async (loginCredentials: LoginFormValues): Promise<boolean> => {
    try {
      const { data } = await myApi.post<userCredentials>(
        '/api/auth/login',
        loginCredentials,
      );
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, data.token);
      setUser(data.user);
      return true;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return false;
    }
  };

  const register = async (
    registerCredentials: RegisterFormValues,
  ): Promise<boolean> => {
    try {
      const { data } = await myApi.post<userCredentials>(
        '/api/auth/register',
        registerCredentials,
      );
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, data.token);
      setUser(data.user);
      return true;
    } catch (error) {
      console.error('Error al registrar:', error);
      return false;
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    setUser(null);
  };

  const values = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');

  return ctx;
};
