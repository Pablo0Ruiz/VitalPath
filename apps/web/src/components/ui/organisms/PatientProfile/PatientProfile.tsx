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

const roleLabel: Record<string, string> = {
  paciente: 'Paciente',
  medico: 'Médico',
  admin: 'Admin',
  trabajador_centro: 'Personal',
  cuidador: 'Cuidador',
};

interface PatientProfileProps {
  patient: IPatientProfile;
}

const PatientProfile = ({ patient }: PatientProfileProps) => {
  const [activeTab, setActiveTab] = useState('citas');
  const fullName = `${patient.name} ${patient.lastName}`;

  return (
    <div className="flex flex-col gap-5">
      <Card padding="none" className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-br from-brand-primary-50 via-brand-primary-50/60 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-[3px] bg-linear-to-r from-brand-primary-500 to-brand-accent-ai" />

        <div className="relative px-6 py-5 flex items-center gap-4">
          <div className="relative shrink-0">
            <Avatar name={fullName} size="lg" />
            <div className="absolute -inset-[3px] rounded-full ring-2 ring-brand-primary-200 pointer-events-none" />
          </div>

          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold text-brand-text-primary tracking-tight">
                {fullName}
              </h1>
              <Badge variant="brand" size="sm" className="capitalize shrink-0">
                {roleLabel[patient.role] ?? patient.role}
              </Badge>
            </div>
            <span className="text-sm text-brand-text-secondary truncate">
              {patient.email}
            </span>
          </div>
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
        <div className="px-6 py-5">
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
