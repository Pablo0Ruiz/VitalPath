'use client';

import { useRef } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Loading, FileUploadIcon } from '@hugeicons/core-free-icons';

import { Badge } from '@/components/ui/atoms/Badge';
import { Button } from '@/components/ui/atoms/Button';
import { Card } from '@/components/ui/atoms/Card';

import { CitaEstadoEnum, type CitaEstado } from '@repo/types';
import {
  useCitasAdministrator,
  useAvanzarCitaEstado,
  useUploadStudy,
} from '@repo/api-client';

type BadgeVariant =
  | 'success'
  | 'warning'
  | 'info'
  | 'brand'
  | 'neutral'
  | 'error';

const ESTADO_BADGE: Record<CitaEstado, BadgeVariant> = {
  agendada: 'warning',
  asistida: 'success',
  en_proceso: 'info',
  resultados_listos: 'brand',
  completada: 'neutral',
  cancelada: 'error',
};

const ESTADO_LABEL: Record<CitaEstado, string> = {
  agendada: 'Agendada',
  asistida: 'Asistida',
  en_proceso: 'En proceso',
  resultados_listos: 'Resultados listos',
  completada: 'Completada',
  cancelada: 'Cancelada',
};

const NEXT_ESTADO: Partial<Record<CitaEstado, CitaEstado>> = {
  [CitaEstadoEnum.AGENDADA]: CitaEstadoEnum.ASISTIDA,
  [CitaEstadoEnum.ASISTIDA]: CitaEstadoEnum.EN_PROCESO,
};

const ACTION_LABEL: Partial<Record<CitaEstado, string>> = {
  [CitaEstadoEnum.AGENDADA]: 'Check-in',
  [CitaEstadoEnum.ASISTIDA]: 'Muestra tomada',
};

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

const CheckInTable = () => {
  const { data: citas, isLoading } = useCitasAdministrator();
  const { mutate: avanzarEstado } = useAvanzarCitaEstado();

  if (isLoading) {
    return (
      <HugeiconsIcon
        icon={Loading}
        className="size-10 animate-spin text-brand-primary"
      />
    );
  }

  const rows = citas || [];

  return (
    <Card padding="none" className="flex flex-col gap-0 overflow-hidden">
      <div className="px-5 py-4 border-b border-brand-border">
        <h3 className="text-sm font-semibold text-brand-text-primary">
          Agenda del día
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-brand-neutral-50 border-b border-brand-border">
              {[
                'Hora',
                'Paciente',
                'Médico',
                'Especialidad',
                'Estado',
                'Acción',
              ].map(h => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold text-brand-text-secondary uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => {
              const nextEstado = NEXT_ESTADO[row.estado];
              const actionLabel = ACTION_LABEL[row.estado];

              return (
                <tr
                  key={row._id}
                  className="border-b border-brand-border last:border-0 hover:bg-brand-neutral-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-brand-text-primary">
                    {row.hora}
                  </td>
                  <td className="px-4 py-3 text-brand-text-primary">
                    {row.paciente_ID.name} {row.paciente_ID.lastName}
                  </td>
                  <td className="px-4 py-3 text-brand-text-secondary">
                    {row.medico_ID.name} {row.medico_ID.lastName}
                  </td>
                  <td className="px-4 py-3 text-brand-text-secondary">
                    {row.medico_ID.especialidad}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={ESTADO_BADGE[row.estado]} size="sm">
                      {ESTADO_LABEL[row.estado]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {row.estado === CitaEstadoEnum.EN_PROCESO ? (
                      <UploadCell
                        citaId={row._id}
                        pacienteId={row.paciente_ID._id}
                      />
                    ) : nextEstado && actionLabel ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          avanzarEstado({ id: row._id, estado: nextEstado })
                        }
                      >
                        {actionLabel}
                      </Button>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default CheckInTable;
