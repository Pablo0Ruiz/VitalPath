import { Card } from '@/components/ui/atoms/Card';
import { Button } from '@/components/ui/atoms/Button';

const CenterCodePanel = () => {
  return (
    <Card padding="md" className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-brand-text-primary">
          Código de Vinculación del Centro
        </h3>
      </div>

      <div className="flex flex-col items-center gap-3 py-4">
        <span className="font-mono text-4xl font-bold text-brand-primary-700 tracking-widest">
          A4F-29K
        </span>
        <p className="text-xs text-brand-text-secondary text-center max-w-xs">
          Compartí este código con tu personal para que vinculen sus perfiles
        </p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-brand-text-secondary">
          Último reseteo: 15 abr. 2026
        </span>
        <Button variant="danger" size="sm">
          Resetear código
        </Button>
      </div>
    </Card>
  );
};

export default CenterCodePanel;
