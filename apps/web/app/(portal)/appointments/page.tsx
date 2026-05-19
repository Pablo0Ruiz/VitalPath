'use client';

import { useState } from 'react';
import DataTable from '@/components/ui/molecules/DataTable/DataTable';
import Modal from '@/components/ui/atoms/Modal/Modal';
import { Button } from '@/components/ui/atoms/Button';
import { BookAppointmentForm } from '@/components/ui/organisms/BookAppointmentForm';
import { useCitasAdministrator } from '@repo/api-client';
import type { CitaPopulated } from '@repo/types';
import { buildAppointmentColumns } from './appointments.constants';
import CancelCitaConfirm from './CancelCitaConfirm';

export default function AppointmentsPage() {
  const { data: citas, isLoading } = useCitasAdministrator();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCita, setEditingCita] = useState<CitaPopulated | null>(null);
  const [cancelingCita, setCancelingCita] = useState<CitaPopulated | null>(
    null,
  );

  const columns = buildAppointmentColumns({
    onEdit: c => setEditingCita(c),
    onCancel: c => setCancelingCita(c),
  });

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

      {!isLoading && (!citas || citas.length === 0) && (
        <p className="text-sm text-brand-text-secondary text-center py-8">
          No hay citas registradas.
        </p>
      )}

      <DataTable
        columns={columns}
        data={citas}
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
    </div>
  );
}
