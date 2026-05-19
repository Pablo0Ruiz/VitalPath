'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@repo/store';
import { Search01Icon } from '@hugeicons/core-free-icons';
import { useAuditLogs } from '@repo/api-client';
import type { AuditLogQuery } from '@repo/types';
import { Skeleton } from '@/components/ui/atoms/Skeleton';
import { DataTable } from '@/components/ui/molecules/DataTable';
import { EmptyState } from '@/components/ui/molecules/EmptyState';
import { auditLogColumns } from './audit-logs.constants';

const ALLOWED_ROLES = ['admin'];

export default function AuditLogsPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [filters, setFilters] = useState<AuditLogQuery>({});
  const [actionInput, setActionInput] = useState('');
  const [userIdInput, setUserIdInput] = useState('');

  useEffect(() => {
    if (user && !ALLOWED_ROLES.includes(user.role || '')) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  const { data, isLoading } = useAuditLogs(filters);

  const handleFilter = () => {
    setFilters({
      ...(actionInput ? { action: actionInput } : {}),
      ...(userIdInput ? { userId: userIdInput } : {}),
    });
  };

  const handleClear = () => {
    setActionInput('');
    setUserIdInput('');
    setFilters({});
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-brand-text-primary">Auditoría</h1>

      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-brand-text-secondary">Acción</label>
          <input
            className="border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-600"
            placeholder="VIEW_MEDICAL_DATA"
            value={actionInput}
            onChange={e => setActionInput(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-brand-text-secondary">
            Usuario (ID)
          </label>
          <input
            className="border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-600"
            placeholder="ID de usuario"
            value={userIdInput}
            onChange={e => setUserIdInput(e.target.value)}
          />
        </div>
        <button
          className="px-4 py-2 bg-brand-primary-600 text-white text-sm rounded-lg hover:bg-brand-primary-700 transition-colors"
          onClick={handleFilter}
        >
          Filtrar
        </button>
        <button
          className="px-4 py-2 border border-brand-border text-sm rounded-lg hover:bg-brand-neutral-50 transition-colors"
          onClick={handleClear}
        >
          Limpiar
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : data && data.length > 0 ? (
        <DataTable
          columns={auditLogColumns}
          data={data}
          ariaLabel="Registros de auditoría"
          getRowKey={row => row._id}
        />
      ) : (
        <EmptyState
          icon={Search01Icon}
          title="Sin registros"
          description="No se encontraron registros de auditoría con los filtros aplicados."
        />
      )}
    </div>
  );
}
