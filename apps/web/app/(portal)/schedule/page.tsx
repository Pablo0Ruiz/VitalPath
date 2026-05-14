import { HugeiconsIcon } from '@hugeicons/react';
import { CalendarAdd01Icon } from '@hugeicons/core-free-icons';

export default function SchedulePage() {
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="max-w-md w-full rounded-2xl border border-brand-border bg-brand-background p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary-100">
          <HugeiconsIcon
            icon={CalendarAdd01Icon}
            size={24}
            className="text-brand-primary-700"
          />
        </div>
        <h1 className="text-lg font-semibold text-brand-text-primary mb-2">
          Agenda de citas
        </h1>
        <p className="text-sm text-brand-text-secondary">
          Próximamente. Estamos trabajando en este flujo.
        </p>
      </div>
    </div>
  );
}
