'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { FileUploadIcon } from '@hugeicons/core-free-icons';
import { Card } from '@/components/ui/atoms/Card';
import { Select } from '@/components/ui/atoms/Select';
import { Spinner } from '@/components/ui/atoms/Spinner';
import { FormField } from '@/components/ui/molecules/FormField';

const patientOptions = [
  { value: '1', label: 'María González' },
  { value: '2', label: 'Carlos López' },
  { value: '3', label: 'Ana Martínez' },
];

const StudyUploadModule = () => {
  return (
    <Card padding="md" className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-brand-text-primary">
        Cargar estudio
      </h3>

      <FormField label="Paciente">
        <Select options={patientOptions} placeholder="Seleccioná un paciente" />
      </FormField>

      <div className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-brand-border rounded-xl p-8 bg-brand-neutral-50 cursor-pointer hover:bg-brand-neutral-100 transition-colors">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-primary-100 text-brand-primary-600">
          <HugeiconsIcon icon={FileUploadIcon} size={24} />
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm font-medium text-brand-text-primary">
            Arrastrá el PDF aquí
          </span>
          <span className="text-xs text-brand-text-secondary">
            o hacé click para seleccionar
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 p-3 bg-brand-primary-50 rounded-xl border border-brand-primary-100">
        <Spinner tone="brand" size={18} />
        <span className="text-sm font-medium text-brand-primary-700">
          IA Procesando Resumen...
        </span>
      </div>
    </Card>
  );
};

export default StudyUploadModule;
