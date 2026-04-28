'use client';

import { useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { FileUploadIcon } from '@hugeicons/core-free-icons';
import { Card } from '@/components/ui/atoms/Card';
import { Select } from '@/components/ui/atoms/Select';
import { Button } from '@/components/ui/atoms/Button';
import { Spinner } from '@/components/ui/atoms/Spinner';
import { FormField } from '@/components/ui/molecules/FormField';
import { useCitasMedico, useUploadStudy } from '@repo/api-client';

const StudyUploadModule = () => {
  const { data: citas } = useCitasMedico();
  const { mutate: upload, isPending, isSuccess, isError } = useUploadStudy();

  const [selectedCitaId, setSelectedCitaId] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const patientOptions = (citas ?? []).map(c => ({
    value: c._id,
    label: `${c.paciente_ID.name} ${c.paciente_ID.lastName}`,
  }));

  const handleFile = (f: File | undefined) => {
    if (f && f.type === 'application/pdf') setFile(f);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = () => {
    if (!file || !selectedCitaId) return;
    const cita = citas?.find(c => c._id === selectedCitaId);
    if (!cita) return;
    upload(
      { file, ctx: { paciente_ID: cita.paciente_ID._id, cita_ID: cita._id } },
      {
        onSuccess: () => {
          setFile(null);
          setSelectedCitaId('');
        },
      },
    );
  };

  return (
    <Card padding="md" className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-brand-text-primary">
        Cargar estudio
      </h3>

      <FormField label="Paciente">
        <Select
          options={patientOptions}
          placeholder="Seleccioná un paciente"
          value={selectedCitaId}
          onChange={e => setSelectedCitaId(e.target.value)}
        />
      </FormField>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors ${
          isDragging
            ? 'border-brand-primary-400 bg-brand-primary-50'
            : 'border-brand-border bg-brand-neutral-50 hover:bg-brand-neutral-100'
        }`}
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-primary-100 text-brand-primary-600">
          <HugeiconsIcon icon={FileUploadIcon} size={24} />
        </div>
        <div className="flex flex-col items-center gap-1">
          {file ? (
            <span className="text-sm font-medium text-brand-primary-700">
              {file.name}
            </span>
          ) : (
            <>
              <span className="text-sm font-medium text-brand-text-primary">
                Arrastrá el PDF aquí
              </span>
              <span className="text-xs text-brand-text-secondary">
                o hacé click para seleccionar
              </span>
            </>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={e => handleFile(e.target.files?.[0])}
        />
      </div>

      {isPending && (
        <div className="flex items-center justify-center gap-3 p-3 bg-brand-primary-50 rounded-xl border border-brand-primary-100">
          <Spinner tone="brand" size={18} />
          <span className="text-sm font-medium text-brand-primary-700">
            IA Procesando Resumen...
          </span>
        </div>
      )}

      {isSuccess && (
        <p className="text-sm text-center text-green-600 font-medium">
          Estudio cargado correctamente.
        </p>
      )}

      {isError && (
        <p className="text-sm text-center text-red-500">
          Error al subir el estudio. Intentá de nuevo.
        </p>
      )}

      <Button
        onClick={handleUpload}
        disabled={!file || !selectedCitaId || isPending}
        variant="primary"
        size="sm"
      >
        Subir estudio
      </Button>
    </Card>
  );
};

export default StudyUploadModule;
