import type { Column } from '@/components/ui/molecules/DataTable/DataTable';
import type { AuditLog } from '@repo/types';

export const auditLogColumns: Column<AuditLog>[] = [
  {
    key: 'createdAt',
    label: 'Fecha',
    render: row => new Date(row.createdAt).toLocaleString('es-AR'),
  },
  { key: 'action', label: 'Acción' },
  { key: 'userId', label: 'Usuario' },
  {
    key: 'resourceId',
    label: 'Recurso',
    render: row => <code className="text-xs">{row.resourceId}</code>,
  },
];
