import { HugeiconsIcon } from '@hugeicons/react';
import { Clock01Icon } from '@hugeicons/core-free-icons';
import { Card } from '@/components/ui/atoms/Card';
import { Badge } from '@/components/ui/atoms/Badge';
import { cn } from '@/lib/utils';

type AppointmentState = 'agendada' | 'asistida' | 'en_proceso' | 'cancelada';

type AppointmentCardProps = {
  patientName: string;
  time: string;
  estado: AppointmentState;
  compact?: boolean;
  className?: string;
};

const estadoConfig: Record<
  AppointmentState,
  {
    label: string;
    variant: 'success' | 'warning' | 'info' | 'error' | 'neutral';
  }
> = {
  agendada: { label: 'Agendada', variant: 'info' },
  asistida: { label: 'Asistida', variant: 'success' },
  en_proceso: { label: 'En proceso', variant: 'warning' },
  cancelada: { label: 'Cancelada', variant: 'error' },
};

const AppointmentCard = ({
  patientName,
  time,
  estado,
  compact,
  className,
}: AppointmentCardProps) => {
  const config = estadoConfig[estado] ?? {
    label: estado,
    variant: 'neutral' as const,
  };

  return (
    <Card
      padding={compact ? 'sm' : 'md'}
      className={cn('border-l-4 border-l-brand-primary-600', className)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-sm font-semibold text-brand-text-primary truncate">
            {patientName}
          </span>
          <div className="flex items-center gap-1 text-brand-text-secondary">
            <HugeiconsIcon icon={Clock01Icon} size={13} />
            <span className="text-xs">{time}</span>
          </div>
        </div>
        <Badge variant={config.variant} size="sm">
          {config.label}
        </Badge>
      </div>
    </Card>
  );
};

export default AppointmentCard;
