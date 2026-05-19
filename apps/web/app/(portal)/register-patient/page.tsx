'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@repo/store';
import { RegisterPatientForm } from '@/components/ui/organisms/RegisterPatientForm';
import type { CreatedPatientResponse } from '@repo/api-client';

const ALLOWED_ROLES = ['admin', 'trabajador_centro'];

export default function RegisterPatientPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user && !ALLOWED_ROLES.includes(user.role || '')) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  const handleSuccess = (patient: CreatedPatientResponse) => {
    setSuccessMessage(
      `Paciente ${patient.name} ${patient.lastName} registrado con éxito.`,
    );
    setTimeout(() => {
      router.push(`/patients/${patient._id}`);
    }, 1500);
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-start p-8 gap-4">
      {successMessage && (
        <div className="w-full max-w-2xl rounded-xl bg-brand-state-success-light border border-brand-state-success-dark px-5 py-3">
          <p className="text-sm font-medium text-brand-state-success-dark">
            {successMessage}
          </p>
        </div>
      )}
      <RegisterPatientForm onSuccess={handleSuccess} />
    </div>
  );
}
