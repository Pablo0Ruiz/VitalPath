import type { DashboardAlert } from '@/components/ui/organisms/AlertPanel/types';
import Link from 'next/link';
import { Badge } from '../Badge';

export interface AlertItemProps {
  alert: DashboardAlert;
  buildHref: (alert: DashboardAlert) => string;
}

const AlertItem = ({ alert, buildHref }: AlertItemProps) => (
  <div className="flex items-center justify-between gap-3 py-2">
    <div className="flex items-center gap-2 min-w-0">
      <Badge
        variant={alert.severity === 'error' ? 'error' : 'warning'}
        size="sm"
      >
        {alert.severity === 'error' ? 'Urgente' : 'Aviso'}
      </Badge>
      <span className="text-sm text-brand-text-primary truncate">
        {alert.label}
      </span>
    </div>
    <Link
      href={buildHref(alert)}
      className="text-xs text-brand-primary-600 hover:underline shrink-0"
    >
      Ver
    </Link>
  </div>
);

export default AlertItem;
