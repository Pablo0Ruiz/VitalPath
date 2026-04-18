'use client';

import { useAuthStore } from '@repo/store';
import { useSession } from '@repo/api-client';
import { webTokenAdapter } from '@/adapters/webTokenAdapter';

export function SessionGate({ children }: { children: React.ReactNode }) {
  const { setSession, clearSession, setIsLoading } = useAuthStore();
  useSession(webTokenAdapter, { setSession, clearSession, setIsLoading });
  return <>{children}</>;
}
