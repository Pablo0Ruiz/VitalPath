import { useRef } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { FileUploadIcon } from '@hugeicons/core-free-icons';
import { Button } from '../../atoms';
import { useUploadStudy } from '@repo/api-client';

const UploadCell = ({
  citaId,
  pacienteId,
}: {
  citaId: string;
  pacienteId: string;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: upload, isPending } = useUploadStudy();

  const handleFile = (file: File | undefined) => {
    if (!file || file.type !== 'application/pdf') return;
    upload({ file, ctx: { paciente_ID: pacienteId, cita_ID: citaId } });
  };

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        disabled={isPending}
        onClick={() => inputRef.current?.click()}
      >
        <HugeiconsIcon icon={FileUploadIcon} size={14} />
        {isPending ? 'Subiendo...' : 'Subir resultado'}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={e => handleFile(e.target.files?.[0])}
      />
    </>
  );
};

export default UploadCell;
