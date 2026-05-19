import { apiClient } from '../client';
import type { AuditLog, AuditLogQuery } from '@repo/types';

export const getAuditLogs = async (
  query?: AuditLogQuery,
): Promise<AuditLog[]> => {
  const { data } = await apiClient.get<AuditLog[]>('/api/audit-logs', {
    params: query,
  });
  return data;
};
