import type { Role } from '@repo/types';
import { TAB_ROUTES } from './routes';

export function getVisibleTabs(role: Role | null) {
  if (!role) return [];
  return TAB_ROUTES.filter(route =>
    route.allowedRoles ? route.allowedRoles.includes(role) : true,
  );
}
