import { useAuthStore } from '@repo/store';
import { useSession } from '@repo/api-client';
import { mobileTokenAdapter } from '@/src/adapters/mobileTokenAdapter';

export const SessionGate = ({ children }: { children: React.ReactNode }) => {
  const { setSession, clearSession, setIsLoading } = useAuthStore();
  useSession(mobileTokenAdapter, { setSession, clearSession, setIsLoading });
  return <>{children}</>;
};
