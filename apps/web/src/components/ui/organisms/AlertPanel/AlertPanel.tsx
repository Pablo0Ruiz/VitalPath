'use client';

import { useMemo } from 'react';
import { Tick02Icon } from '@hugeicons/core-free-icons';
import { Card } from '@/components/ui/atoms/Card';
import { Badge } from '@/components/ui/atoms/Badge';
import { Skeleton } from '@/components/ui/atoms/Skeleton';
import { EmptyState } from '@/components/ui/molecules/EmptyState';
import { cn } from '@/lib/utils';
import type { DashboardAlert, AlertKind } from './types';
import { AlertSection } from '../../molecules/AlertSection';

type AlertPanelProps = {
  alerts: DashboardAlert[];
  isLoading?: boolean;
  isError?: boolean;
  className?: string;
};

function buildHref(alert: DashboardAlert): string {
  if (alert.kind === 'no_show' || alert.kind === 'stale_results') {
    return `/dashboard?citaId=${alert.citaId}`;
  }
  return `/dashboard?medicoId=${alert.medicoId}`;
}

const SECTION_TITLES: Record<AlertKind, string> = {
  no_show: 'Sin asistir',
  stale_results: 'Resultados pendientes',
  doctor_overload: 'Sobrecarga médica',
};

const AlertPanel = ({
  alerts,
  isLoading,
  isError,
  className,
}: AlertPanelProps) => {
  const noShowItems = useMemo(
    () =>
      alerts.filter(
        (a): a is Extract<DashboardAlert, { kind: 'no_show' }> =>
          a.kind === 'no_show',
      ),
    [alerts],
  );
  const staleItems = useMemo(
    () =>
      alerts.filter(
        (a): a is Extract<DashboardAlert, { kind: 'stale_results' }> =>
          a.kind === 'stale_results',
      ),
    [alerts],
  );
  const overloadItems = useMemo(
    () =>
      alerts.filter(
        (a): a is Extract<DashboardAlert, { kind: 'doctor_overload' }> =>
          a.kind === 'doctor_overload',
      ),
    [alerts],
  );

  return (
    <Card className={cn('flex flex-col gap-4 p-4', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-brand-text-primary">
          Alertas operativas
        </h2>
        {!isLoading && !isError && alerts.length > 0 && (
          <Badge variant="neutral" size="sm">
            {alerts.length} activas
          </Badge>
        )}
      </div>

      {isError && (
        <p className="text-sm text-brand-state-error">
          No pudimos cargar las alertas. Reintentando…
        </p>
      )}

      {!isError && isLoading && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-6 w-2/3" />
        </div>
      )}

      {!isError && !isLoading && alerts.length === 0 && (
        <EmptyState
          icon={Tick02Icon}
          title="Sin alertas"
          description="Todo el día está bajo control."
        />
      )}

      {!isError && !isLoading && alerts.length > 0 && (
        <div className="flex flex-col gap-4">
          <AlertSection
            title={SECTION_TITLES.no_show}
            items={noShowItems}
            buildHref={buildHref}
          />
          <AlertSection
            title={SECTION_TITLES.stale_results}
            items={staleItems}
            buildHref={buildHref}
          />
          <AlertSection
            title={SECTION_TITLES.doctor_overload}
            items={overloadItems}
            buildHref={buildHref}
          />
        </div>
      )}
    </Card>
  );
};

export default AlertPanel;
