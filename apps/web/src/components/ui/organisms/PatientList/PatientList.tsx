'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search01Icon } from '@hugeicons/core-free-icons';
import { Card } from '@/components/ui/atoms/Card';
import { Input } from '@/components/ui/atoms/Input';
import { Tabs } from '@/components/ui/atoms/Tabs';
import { Avatar } from '@/components/ui/atoms/Avatar';
import { Badge } from '@/components/ui/atoms/Badge';
import { useCitasMedico } from '@repo/api-client';

const statusTabs = [
  { value: 'all', label: 'Todos' },
  { value: 'activo', label: 'Activos' },
  { value: 'inactivo', label: 'Inactivos' },
];

const PatientList = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { data: citas, isLoading, isError, error } = useCitasMedico();

  if (isLoading) {
    return <div>Cargando pacientes...</div>;
  }
  if (isError) {
    return <div>Error al cargar pacientes: {error.message}</div>;
  }

  const seenIds = new Set();
  const filtered = citas?.filter(p => {
    if (!p.paciente_ID || typeof p.paciente_ID === 'string') return false;

    const fullName =
      `${p.paciente_ID.name} ${p.paciente_ID.lastName}`.toLowerCase();
    const matchSearch = fullName.includes(search.toLowerCase());

    const matchStatus = statusFilter === 'all' || p.estado === statusFilter;

    if (matchSearch && matchStatus) {
      if (seenIds.has(p.paciente_ID._id)) return false;
      seenIds.add(p.paciente_ID._id);
      return true;
    }
    return false;
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
        <Tabs
          tabs={statusTabs}
          value={statusFilter}
          onChange={setStatusFilter}
          variant="pill"
        />
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="px-5 py-4 border-b border-brand-border">
          <span className="text-sm font-semibold text-brand-text-primary">
            Pacientes ({filtered?.length})
          </span>
        </div>
        <div className="divide-y divide-brand-border">
          {filtered?.map(patient => (
            <Link
              key={patient._id}
              href={`/patients/${patient.paciente_ID._id}`}
              className="flex items-center gap-4 px-5 py-4 hover:bg-brand-neutral-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-600"
            >
              <Avatar
                name={`${patient.paciente_ID.name} ${patient.paciente_ID.lastName}`}
                size="md"
              />
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="text-sm font-semibold text-brand-text-primary">
                  {patient.paciente_ID.name} {patient.paciente_ID.lastName}
                </span>
              </div>
              <Badge
                variant={patient.estado === 'agendada' ? 'success' : 'neutral'}
                size="sm"
                className="capitalize shrink-0"
              >
                {patient.estado}
              </Badge>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default PatientList;
