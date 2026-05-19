'use client';

import { useState } from 'react';
import type { DoctorSession } from '@repo/api-client';
import DoctorListPanel from './DoctorListPanel';
import ScheduleEditor from './ScheduleEditor';

const DoctorScheduleManager = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorSession | null>(
    null,
  );

  const handleSelectDoctor = (doctor: DoctorSession) => {
    setSelectedDoctor(doctor);
  };

  const handleSaved = () => {};

  return (
    <div className="flex flex-1 gap-6 h-full min-h-0">
      <div className="w-80 shrink-0 flex flex-col">
        <DoctorListPanel
          selectedUserId={selectedDoctor?.user._id ?? null}
          onSelect={handleSelectDoctor}
        />
      </div>
      <div className="flex-1 rounded-2xl border border-brand-border bg-brand-background p-6 flex flex-col">
        {selectedDoctor ? (
          <ScheduleEditor
            key={selectedDoctor.user._id}
            doctorUserId={selectedDoctor.user._id}
            doctorName={`${selectedDoctor.user.name} ${selectedDoctor.user.lastName}`}
            especialidad={selectedDoctor.especialidad}
            initialSlots={selectedDoctor.slots}
            onSaved={handleSaved}
          />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <p className="text-base font-medium text-brand-text-primary">
              Seleccioná un médico
            </p>
            <p className="text-sm text-brand-text-secondary max-w-xs">
              Elegí un médico de la lista para ver y editar sus horarios
              disponibles.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorScheduleManager;
