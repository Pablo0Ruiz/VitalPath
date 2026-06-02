'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
  const [statusFilter, setStatusFilter] = useState('all');
  const [invitedIds, setInvitedIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('vitalpath_invited_doctors');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing invited doctors:', e);
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    if (invitedIds.length > 0) {
      localStorage.setItem(
        'vitalpath_invited_doctors',
        JSON.stringify(invitedIds),
      );
    }
  }, [invitedIds]);

  const { data: doctors, isLoading, error } = useDoctors();
  const {
    mutateAsync: inviteDoctor,
    isPending: isInviting,
    variables: invitingId,
  } = useInviteDoctor();

  if (error)
    return (
      <div className="p-8 text-sm text-brand-state-error">
        No se pudieron cargar los médicos.
      </div>
    );

  if (isLoading)
    return (
      <div className="flex items-center gap-3 p-8 text-sm text-brand-text-secondary">
        <div className="w-5 h-5 rounded-full border-2 border-brand-primary-300 border-t-transparent animate-spin" />
        Cargando médicos...
      </div>
    );

  const filteredDoctors = doctors?.filter(doctor => {
    const fullName =
      `${doctor.user.name} ${doctor.user.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(search.toLowerCase()) ||
      doctor.user.email.toLowerCase().includes(search.toLowerCase());

    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'activo') return matchesSearch && doctor.user.isActive;
    if (statusFilter === 'inactivo')
      return matchesSearch && !doctor.user.isActive;
    return matchesSearch;
  });

  const handleInviteDoctor = async (doctorId: string) => {
    try {
      await inviteDoctor(doctorId);
      setInvitedIds(prev => [...prev, doctorId]);
    } catch (error) {
      console.error('Error al enviar el código de verificación:', error);
    }
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

      <Card padding="none" className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-linear-to-r from-brand-primary-500 to-brand-secondary-500" />
        <div className="px-5 py-4 border-b border-brand-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-text-secondary">
              Médicos
            </span>
            <span className="text-xs font-semibold bg-brand-primary-50 text-brand-primary-700 px-2.5 py-0.5 rounded-full border border-brand-primary-100">
              {filteredDoctors?.length}
            </span>
          </div>
        </div>
        <div className="divide-y divide-brand-border">
          {filteredDoctors?.map(doctor => (
            <Link
              key={doctor._id}
              href={`/doctors/${doctor._id}`}
              className="flex items-center gap-4 px-5 py-4 hover:bg-brand-primary-50/30 hover:border-l-2 hover:border-l-brand-primary-200 transition-colors no-underline"
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
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleInviteDoctor(doctor._id);
                  }}
                  disabled={invitedIds.includes(doctor._id)}
                  loading={isInviting && invitingId === doctor._id}
                >
                  {invitedIds.includes(doctor._id)
                    ? 'Código enviado'
                    : 'Enviar código de verificación'}
                </Button>
              )}
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DoctorList;
