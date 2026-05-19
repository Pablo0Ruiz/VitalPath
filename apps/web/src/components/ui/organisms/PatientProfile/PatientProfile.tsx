'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/atoms/Card';
import { Avatar } from '@/components/ui/atoms/Avatar';
import { Badge } from '@/components/ui/atoms/Badge';
import { Tabs } from '@/components/ui/atoms/Tabs';
import type { IPatientProfile } from '@repo/types';
import AppointmentsTab from './tabs/AppointmentsTab';
import MedicationsTab from './tabs/MedicationsTab';
import NotesTab from './tabs/NotesTab';
import StudiesTab from './tabs/StudiesTab';

const profileTabs = [
  { value: 'citas', label: 'Citas' },
  { value: 'medicamentos', label: 'Medicamentos' },
  { value: 'notas', label: 'Notas del médico' },
  { value: 'estudios', label: 'Estudios' },
];

interface PatientProfileProps {
  patient: IPatientProfile;
}

const PatientProfile = ({ patient }: PatientProfileProps) => {
  const [activeTab, setActiveTab] = useState('citas');

  const fullName = `${patient.name} ${patient.lastName}`;

  return (
    <div className="flex flex-col gap-6">
      <Card padding="none" className="overflow-hidden">
        <div className="px-6 py-5 flex items-center gap-4">
          <Avatar name={fullName} size="lg" />
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-brand-text-primary">
              {fullName}
            </h1>
            <span className="text-sm text-brand-text-secondary">
              {patient.email}
            </span>
          </div>
          <Badge variant="neutral" size="sm" className="capitalize shrink-0">
            {patient.role}
          </Badge>
        </div>
      </Card>

      <Card padding="none" className="overflow-hidden">
        <div className="px-6 pt-4 border-b border-brand-border">
          <Tabs
            tabs={profileTabs}
            value={activeTab}
            onChange={setActiveTab}
            variant="underline"
          />
        </div>
        <div className="px-6 py-4">
          {activeTab === 'citas' && <AppointmentsTab patientId={patient._id} />}
          {activeTab === 'medicamentos' && (
            <MedicationsTab patientId={patient._id} />
          )}
          {activeTab === 'notas' && <NotesTab patientId={patient._id} />}
          {activeTab === 'estudios' && <StudiesTab patientId={patient._id} />}
        </div>
      </Card>
    </div>
  );
};

export default PatientProfile;
