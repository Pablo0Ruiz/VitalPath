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
    return (
      <div className="flex items-center gap-3 p-8 text-sm text-brand-text-secondary">
        <div className="w-5 h-5 rounded-full border-2 border-brand-primary-300 border-t-transparent animate-spin" />
        Cargando pacientes...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-sm text-brand-state-error">
        No se pudieron cargar los pacientes del centro.
      </div>
    );
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

      <Card padding="none" className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-linear-to-r from-brand-primary-400 to-brand-secondary-500" />
        <div className="px-5 py-4 border-b border-brand-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-text-secondary">
              Pacientes del centro
            </span>
            <span className="text-xs font-semibold bg-brand-primary-50 text-brand-primary-700 px-2.5 py-0.5 rounded-full border border-brand-primary-100">
              {filtered.length}
            </span>
          </div>
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
              className="flex items-center gap-4 px-5 py-3.5 hover:bg-brand-primary-50/30 transition-colors"
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
