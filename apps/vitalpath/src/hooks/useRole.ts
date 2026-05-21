import { normalizeRole } from '@repo/types';
import type { Role } from '@repo/types';
import { useAuthStore } from '@/src/stores/auth';

export function useRole(): Role | null {
  const role = useAuthStore(s => s.user?.role);
  return normalizeRole(role) ?? null;
}
