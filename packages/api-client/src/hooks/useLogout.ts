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
    // Revoke the server-side refresh token FIRST so the httpOnly cookie becomes invalid.
    // If the backend call fails we still clear the local session (best-effort logout).
    try {
      await apiClient.post('/api/auth/logout');
    } catch {
      // best-effort: backend already may have the session expired; do not block local cleanup
    }

    callbacks.clearSession();
    await adapter.deleteToken();
    queryClient.clear();
    adapter.navigate(options.loginRoute);
  };

  return { logout };
};
