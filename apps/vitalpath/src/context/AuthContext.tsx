import { createContext, useContext, useState, ReactNode } from 'react';

export const ACCESS_TOKEN_KEY = 'access_token';

export interface UserSession {
  id: string;
  name: string;
  lastName?: string;
  email: string;
}

export type userCredentials = {
  token: string;
  user: UserSession;
};

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setSession: (user: UserSession) => void;
  clearSession: () => void;
  setIsLoading: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setSession = (authenticatedUser: UserSession) => {
    setUser(authenticatedUser);
  };

  const clearSession = () => {
    setUser(null);
  };

  const values: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    setSession,
    clearSession,
    setIsLoading,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');

  return ctx;
};
