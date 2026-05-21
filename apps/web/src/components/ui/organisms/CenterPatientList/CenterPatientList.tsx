'use client';

import { useState } from 'react';
import { Search01Icon } from '@hugeicons/core-free-icons';
import { Card } from '@/components/ui/atoms/Card';
import { Input } from '@/components/ui/atoms/Input';
import { Avatar } from '@/components/ui/atoms/Avatar';
import { useCenterPatients } from '@repo/api-client';

const CenterPatientList = () => {
  const [search, setSearch] = useState('');
  const { data: patients, isLoading, isError } = useCenterPatients();

  if (isLoading) {
    return <div>Cargando pacientes...</div>;
  }

  if (isError) {
    return <div>Error al cargar los pacientes del centro.</div>;
  }

  const filtered = (patients ?? []).filter(p => {
    const fullName = `${p.name} ${p.lastName}`.toLowerCase();
    return (
      fullName.includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Buscar por nombre o email..."
            leftIcon={Search01Icon}
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
          />
        </div>
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="px-5 py-4 border-b border-brand-border">
          <span className="text-sm font-semibold text-brand-text-primary">
            Pacientes del centro ({filtered.length})
          </span>
        </div>
        <div className="divide-y divide-brand-border">
          {filtered.length === 0 && (
            <p className="px-5 py-8 text-sm text-brand-text-secondary text-center">
              No se encontraron pacientes.
            </p>
          )}
          {filtered.map(patient => (
            <div
              key={patient._id}
              className="flex items-center gap-4 px-5 py-4"
            >
              <Avatar name={`${patient.name} ${patient.lastName}`} size="md" />
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="text-sm font-semibold text-brand-text-primary">
                  {patient.name} {patient.lastName}
                </span>
                <span className="text-xs text-brand-text-secondary truncate">
                  {patient.email}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default CenterPatientList;
