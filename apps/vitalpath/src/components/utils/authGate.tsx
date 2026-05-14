import { useAuthStore } from '@/src/stores/auth';
import { useSession } from '@repo/api-client';
import { mobileTokenAdapter } from '@/src/adapters/mobileTokenAdapter';

export const SessionGate = ({ children }: { children: React.ReactNode }) => {
  const { setSession, clearSession, setIsLoading, _hasHydrated } =
    useAuthStore();

  useSession(
    mobileTokenAdapter,
    { setSession, clearSession, setIsLoading },
    { enabled: _hasHydrated },
  );

  return <>{children}</>;
};
