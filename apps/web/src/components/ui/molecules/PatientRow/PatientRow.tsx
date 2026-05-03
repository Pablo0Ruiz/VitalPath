import { Avatar } from '@/components/ui/atoms/Avatar';
import { Badge } from '@/components/ui/atoms/Badge';

type PatientRowProps = {
  name: string;
  lastName: string;
  email?: string;
  estado: string;
};

const estadoVariant: Record<
  string,
  'success' | 'neutral' | 'error' | 'warning'
> = {
  activo: 'success',
  inactivo: 'neutral',
  asistida: 'success',
  agendada: 'warning',
  en_proceso: 'warning',
  completada: 'success',
  resultados_listos: 'success',
  cancelada: 'error',
};

const PatientRow = ({ name, lastName, email, estado }: PatientRowProps) => {
  const fullName = `${name} ${lastName}`;
  const variant = estadoVariant[estado] ?? 'neutral';

  return (
    <div className="flex items-center gap-3">
      <Avatar name={fullName} size="sm" />
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium text-brand-text-primary truncate">
          {fullName}
        </span>
        <span className="text-xs text-brand-text-secondary truncate">
          {email}
        </span>
      </div>
      <Badge
        variant={variant}
        size="sm"
        className="ml-auto shrink-0 capitalize"
      >
        {estado}
      </Badge>
    </div>
  );
};

export default PatientRow;
