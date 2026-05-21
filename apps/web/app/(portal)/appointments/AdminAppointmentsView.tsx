'use client';

import { useState, useMemo } from 'react';
import DataTable from '@/components/ui/molecules/DataTable/DataTable';
import Modal from '@/components/ui/atoms/Modal/Modal';
import { Button } from '@/components/ui/atoms/Button';
import { Tabs } from '@/components/ui/atoms/Tabs';
import { BookAppointmentForm } from '@/components/ui/organisms/BookAppointmentForm';
import { useCitasAdministrator } from '@repo/api-client';
import {
  CITA_ALLOWED_TRANSITIONS,
  type CitaEstado,
  type CitaPopulated,
} from '@repo/types';
import { isActiveCita, isHistoricalCita } from '@/lib/citaStates';
import { buildAppointmentColumns } from './appointments.constants';
import CancelCitaConfirm from './CancelCitaConfirm';
import AdvanceCitaConfirm from './AdvanceCitaConfirm';

const appointmentTabs = [
  { value: 'activas', label: 'Activas' },
  { value: 'historial', label: 'Historial' },
];

export default function AdminAppointmentsView() {
  const { data: citas, isLoading } = useCitasAdministrator();

  const [activeTab, setActiveTab] = useState<'activas' | 'historial'>(
    'activas',
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCita, setEditingCita] = useState<CitaPopulated | null>(null);
  const [cancelingCita, setCancelingCita] = useState<CitaPopulated | null>(
    null,
  );
  const [advancingCita, setAdvancingCita] = useState<CitaPopulated | null>(
    null,
  );

  const activaCitas = useMemo(
    () => (citas ?? []).filter(c => isActiveCita(c.estado)),
    [citas],
  );

  const historicalCitas = useMemo(
    () => (citas ?? []).filter(c => isHistoricalCita(c.estado)),
    [citas],
  );

  const nextEstado = advancingCita
    ? CITA_ALLOWED_TRANSITIONS[advancingCita.estado as CitaEstado]
    : undefined;

  const columns = buildAppointmentColumns({
    onEdit: c => setEditingCita(c),
    onCancel: c => setCancelingCita(c),
    onAvanzar: c => setAdvancingCita(c),
  });

  const currentRows = activeTab === 'activas' ? activaCitas : historicalCitas;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-brand-text-primary">
          Citas
        </h2>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={() => setShowCreateModal(true)}
        >
          Nueva cita
        </Button>
      </div>

      <Tabs
        tabs={appointmentTabs}
        value={activeTab}
        onChange={v => setActiveTab(v as 'activas' | 'historial')}
        variant="underline"
      />

      {!isLoading && activeTab === 'activas' && activaCitas.length === 0 && (
        <p className="text-sm text-brand-text-secondary text-center py-8">
          No hay citas activas.
        </p>
      )}

      {!isLoading &&
        activeTab === 'historial' &&
        historicalCitas.length === 0 && (
          <p className="text-sm text-brand-text-secondary text-center py-8">
            No hay historial de citas.
          </p>
        )}

      <DataTable
        columns={columns}
        data={currentRows}
        loading={isLoading}
        getRowKey={row => String(row._id)}
      />

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Nueva cita"
      >
        {showCreateModal && (
          <BookAppointmentForm
            mode="create"
            onSuccess={() => setShowCreateModal(false)}
            onCancel={() => setShowCreateModal(false)}
          />
        )}
      </Modal>

      <Modal
        isOpen={!!editingCita}
        onClose={() => setEditingCita(null)}
        title="Editar cita"
      >
        {editingCita && (
          <BookAppointmentForm
            mode="edit"
            initialCita={editingCita}
            onSuccess={() => setEditingCita(null)}
            onCancel={() => setEditingCita(null)}
          />
        )}
      </Modal>

      <Modal
        isOpen={!!cancelingCita}
        onClose={() => setCancelingCita(null)}
        title="Cancelar cita"
      >
        {cancelingCita && (
          <CancelCitaConfirm
            cita={cancelingCita}
            onConfirmed={() => setCancelingCita(null)}
            onCancel={() => setCancelingCita(null)}
          />
        )}
      </Modal>

      <Modal
        isOpen={!!advancingCita && !!nextEstado}
        onClose={() => setAdvancingCita(null)}
        title="Avanzar estado"
      >
        {advancingCita && nextEstado && (
          <AdvanceCitaConfirm
            cita={advancingCita}
            nextEstado={nextEstado}
            onConfirmed={() => setAdvancingCita(null)}
            onCancel={() => setAdvancingCita(null)}
          />
        )}
      </Modal>
    </div>
  );
}
