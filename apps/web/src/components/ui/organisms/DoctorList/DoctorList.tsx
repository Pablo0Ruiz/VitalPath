'use client';

import { useState } from 'react';
import { Search01Icon } from '@hugeicons/core-free-icons';
import { Card } from '@/components/ui/atoms/Card';
import { Input } from '@/components/ui/atoms/Input';
import { Tabs } from '@/components/ui/atoms/Tabs';
import { Avatar } from '@/components/ui/atoms/Avatar';
import { Badge } from '@/components/ui/atoms/Badge';
import { Button } from '../../atoms';
import { useDoctors, useInviteDoctor } from '@repo/api-client';

const statusTabs = [
  { value: 'all', label: 'Todos' },
  { value: 'activo', label: 'Activos' },
  { value: 'inactivo', label: 'Inactivos' },
];

const DoctorList = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('si');
  const [invitedIds, setInvitedIds] = useState<string[]>([]);
  const { data: doctors, isLoading, error } = useDoctors();
  const {
    mutateAsync: inviteDoctor,
    isPending: isInviting,
    variables: invitingId,
  } = useInviteDoctor();

  if (error) return <div>Error al cargar los doctores</div>;

  if (isLoading) return <div>Cargando doctores...</div>;

  const handleInviteDoctor = (doctorId: string) => {
    setInvitedIds(prev => [...prev, doctorId]);
    inviteDoctor(doctorId);
  };

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
            Doctores ({doctors?.length})
          </span>
        </div>
        <div className="divide-y divide-brand-border">
          {doctors?.map(doctor => (
            <div
              key={doctor._id}
              className="flex items-center gap-4 px-5 py-4 hover:bg-brand-neutral-50 transition-colors"
            >
              <Avatar
                name={`${doctor.user.name} ${doctor.user.lastName}`}
                size="md"
              />
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="text-sm font-semibold text-brand-text-primary">
                  {doctor.user.name} {doctor.user.lastName}
                </span>
                <span className="text-xs text-brand-text-secondary truncate">
                  {doctor.user.email}
                </span>
                <span className="text-xs text-brand-text-secondary truncate">
                  {doctor.especialidad}
                </span>
              </div>
              <Badge
                variant={doctor.user.isActive ? 'success' : 'neutral'}
                size="sm"
                className="capitalize shrink-0"
              >
                Verificado : {doctor.user.isActive ? 'si' : 'no'}
              </Badge>
              {doctor.user.isActive === false && (
                <Button
                  onClick={() => handleInviteDoctor(doctor._id)}
                  disabled={invitedIds.includes(doctor._id)}
                  loading={isInviting && invitingId === doctor._id}
                >
                  {invitedIds.includes(doctor._id)
                    ? 'Código enviado'
                    : 'Enviar código de verificación'}
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DoctorList;
