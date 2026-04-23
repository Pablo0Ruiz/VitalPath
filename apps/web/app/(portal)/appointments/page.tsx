'use client';

import { useState } from 'react';
import { Calendar03Icon } from '@hugeicons/core-free-icons';
import { Tabs } from '@/components/ui/atoms/Tabs';
import { EmptyState } from '@/components/ui/molecules/EmptyState';
import DataTable from '@/components/ui/molecules/DataTable/DataTable';
import { useCitasAdministrator } from '@repo/api-client';
import { viewTabs, appointmentColumns } from './appointments.constants';

export default function AppointmentsPage() {
  const [view, setView] = useState('list');
  const { data: citas, isLoading } = useCitasAdministrator();

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
          columns={appointmentColumns}
          data={citas}
          loading={isLoading}
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
