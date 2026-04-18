'use client';

import { useState } from 'react';
import { Calendar03Icon } from '@hugeicons/core-free-icons';
import { Badge } from '@/components/ui/atoms/Badge';
import { Tabs } from '@/components/ui/atoms/Tabs';
import { EmptyState } from '@/components/ui/molecules/EmptyState';
import { DataTable } from '@/components/ui/molecules/DataTable';
import { mockAppointments } from '@/lib/mock-data';

type Appointment = {
  _id: string;
  patientName: string;
  doctorName: string;
  fecha: string;
  estado: string;
  [key: string]: unknown;
};

const estadoConfig: Record<
  string,
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

const viewTabs = [
  { value: 'list', label: 'Lista' },
  { value: 'calendar', label: 'Calendario' },
];

const columns = [
  { key: 'patientName' as const, label: 'Paciente' },
  { key: 'doctorName' as const, label: 'Médico' },
  { key: 'fecha' as const, label: 'Fecha y hora' },
  {
    key: 'estado' as const,
    label: 'Estado',
    render: (row: Appointment) => {
      const config = estadoConfig[String(row.estado)] ?? {
        label: String(row.estado),
        variant: 'neutral' as const,
      };
      return (
        <Badge variant={config.variant} size="sm">
          {config.label}
        </Badge>
      );
    },
  },
];

export default function AppointmentsPage() {
  const [view, setView] = useState('list');
  const appointments: Appointment[] = mockAppointments;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-brand-text-primary">
          Citas
        </h2>
        <Tabs tabs={viewTabs} value={view} onChange={setView} variant="pill" />
      </div>

      {view === 'list' ? (
        <DataTable
          columns={columns}
          data={appointments}
          getRowKey={row => String(row._id)}
        />
      ) : (
        <div className="bg-brand-background border border-brand-border rounded-xl">
          <EmptyState
            icon={Calendar03Icon}
            title="Vista de calendario"
            description="La vista de calendario estará disponible próximamente."
          />
        </div>
      )}
    </div>
  );
}
