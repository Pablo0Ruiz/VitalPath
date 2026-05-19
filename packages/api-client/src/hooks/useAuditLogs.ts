import { useQuery } from '@tanstack/react-query';
import type { AuditLogQuery } from '@repo/types';
import { getAuditLogs } from '../actions/audit.actions';
import { auditKeys } from '../queryKeys';

export const useAuditLogs = (query?: AuditLogQuery) =>
  useQuery({
    queryKey: auditKeys.list(query),
    queryFn: () => getAuditLogs(query),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
