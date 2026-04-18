import { Card } from '@/components/ui/atoms/Card';
import { Badge } from '@/components/ui/atoms/Badge';
import { Button } from '@/components/ui/atoms/Button';
import { mockStudies } from '@/lib/mock-data';

const ReportHistory = () => {
  return (
    <Card padding="md" className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-brand-text-primary">
        Historial de estudios
      </h3>
      <div className="flex flex-col gap-3">
        {mockStudies.map(study => (
          <div
            key={study._id}
            className="flex items-center justify-between gap-3 p-3 bg-brand-neutral-50 rounded-xl border border-brand-border"
          >
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-sm font-medium text-brand-text-primary truncate">
                {study.patientName}
              </span>
              <span className="text-xs text-brand-text-secondary">
                {study.type} · {study.date}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="success" size="sm">
                Resumen listo
              </Badge>
              <Button variant="ghost" size="sm">
                Ver PDF
              </Button>
              <Button variant="outline" size="sm">
                Ver resumen IA
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ReportHistory;
