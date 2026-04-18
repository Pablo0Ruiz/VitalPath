import { useQueryClient } from '@tanstack/react-query';
import type { TokenAdapter } from '@repo/types';

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
    callbacks.clearSession();
    await adapter.deleteToken();
    queryClient.clear();
    adapter.navigate(options.loginRoute);
  };

  return { logout };
};
