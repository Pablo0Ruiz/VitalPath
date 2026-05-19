import { AlertItem } from '../../atoms';
import { DashboardAlert } from '../../organisms/AlertPanel';

export interface AlertSectionProps {
  title: string;
  items: DashboardAlert[];
  buildHref: (alert: DashboardAlert) => string;
}

const AlertSection = ({ title, items, buildHref }: AlertSectionProps) => {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">
        {title}
      </p>
      <div className="divide-y divide-brand-neutral-100">
        {items.map(alert => (
          <AlertItem
            key={
              alert.kind === 'doctor_overload' ? alert.medicoId : alert.citaId
            }
            alert={alert}
            buildHref={buildHref}
          />
        ))}
      </div>
    </div>
  );
};

export default AlertSection;
