'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@repo/store';
import { DoctorScheduleManager } from '@/components/ui/organisms/DoctorScheduleManager';

const ALLOWED_ROLES = ['admin', 'trabajador_centro'];

export default function SchedulePage() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user && !ALLOWED_ROLES.includes(user.role || '')) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="flex flex-col flex-1 gap-4 p-8 min-h-0">
      <div>
        <h1 className="text-xl font-semibold text-brand-text-primary">
          Gestión de horarios
        </h1>
        <p className="text-sm text-brand-text-secondary mt-1">
          Administrá los horarios disponibles de cada médico.
        </p>
      </div>
      <DoctorScheduleManager />
    </div>
  );
}
