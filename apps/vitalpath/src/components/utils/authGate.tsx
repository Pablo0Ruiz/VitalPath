import { useSession } from '@/src/hooks/auth';

export const SessionGate = ({ children }: { children: React.ReactNode }) => {
  useSession();
  return <>{children}</>;
};
