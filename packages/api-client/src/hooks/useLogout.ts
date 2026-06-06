import { useQueryClient } from '@tanstack/react-query';
import type { TokenAdapter } from '@repo/types';
import { apiClient } from '../client';

interface LogoutCallbacks {
  clearSession: () => void;
}

export const useLogout = (
  adapter: TokenAdapter,
  callbacks: LogoutCallbacks,
  options: { loginRoute: string },
) => {
  const queryClient = useQueryClient();

  const logout = async () => {
    try {
      await apiClient.post('/api/auth/logout');
    } catch {}

    callbacks.clearSession();
    await adapter.deleteToken();
    queryClient.clear();
    adapter.navigate(options.loginRoute);
  };

  return { logout };
};
