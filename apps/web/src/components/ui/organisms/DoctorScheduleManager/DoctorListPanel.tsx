'use client';

import { useState } from 'react';
import { Search01Icon } from '@hugeicons/core-free-icons';
import { Input } from '@/components/ui/atoms/Input';
import { Avatar } from '@/components/ui/atoms/Avatar';
import { Card } from '@/components/ui/atoms/Card';
import { useDoctors } from '@repo/api-client';
import type { DoctorSession } from '@repo/api-client';

interface DoctorListPanelProps {
  selectedUserId: string | null;
  onSelect: (doctor: DoctorSession) => void;
}

const DoctorListPanel = ({
  selectedUserId,
  onSelect,
}: DoctorListPanelProps) => {
  const [search, setSearch] = useState('');
  const { data: doctors, isLoading, isError } = useDoctors();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-brand-text-secondary">
        Cargando médicos...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-brand-state-error">
        Error al cargar los médicos.
      </div>
    );
  }

  const filtered = doctors?.filter(doctor => {
    const fullName =
      `${doctor.user.name} ${doctor.user.lastName}`.toLowerCase();
    const query = search.toLowerCase();
    return (
      fullName.includes(query) ||
      doctor.especialidad.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex flex-col gap-3 h-full">
      <Input
        type="search"
        placeholder="Buscar médico..."
        leftIcon={Search01Icon}
        value={search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearch(e.target.value)
        }
      />

      <Card padding="none" className="overflow-hidden flex-1">
        <div className="px-4 py-3 border-b border-brand-border">
          <span className="text-sm font-semibold text-brand-text-primary">
            Médicos ({filtered?.length ?? 0})
          </span>
        </div>
        <div className="divide-y divide-brand-border overflow-y-auto">
          {filtered?.map(doctor => {
            const isSelected = selectedUserId === doctor.user._id;
            return (
              <button
                key={doctor._id}
                type="button"
                onClick={() => onSelect(doctor)}
                className={`flex items-center gap-3 w-full px-4 py-3 text-left transition-colors hover:bg-brand-neutral-50 ${
                  isSelected ? 'bg-brand-primary-100' : ''
                }`}
              >
                <Avatar
                  name={`${doctor.user.name} ${doctor.user.lastName}`}
                  size="md"
                />
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span
                    className={`text-sm font-semibold truncate ${
                      isSelected
                        ? 'text-brand-primary-700'
                        : 'text-brand-text-primary'
                    }`}
                  >
                    {doctor.user.name} {doctor.user.lastName}
                  </span>
                  <span className="text-xs text-brand-text-secondary truncate">
                    {doctor.especialidad}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default DoctorListPanel;
