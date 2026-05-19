'use client';

import { useEffect } from 'react';
import { useParams, notFound, useRouter } from 'next/navigation';
import { usePatientById } from '@repo/api-client';
import { PatientProfile } from '@/components/ui/organisms/PatientProfile';

export default function PatientProfilePage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? '';
  const router = useRouter();

  const { data: patient, isLoading, isError, error } = usePatientById(id);

  useEffect(() => {
    if (!isError) return;
    const status = (error as unknown as { response?: { status: number } })
      ?.response?.status;
    if (status === 401 || status === 403) {
      router.replace('/dashboard');
    }
  }, [isError, error, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-brand-text-secondary">
          Cargando perfil del paciente...
        </p>
      </div>
    );
  }

  if (isError) {
    const status = (error as unknown as { response?: { status: number } })
      ?.response?.status;
    if (status !== 401 && status !== 403) notFound();
    return null;
  }

  if (!patient) notFound();

  return <PatientProfile patient={patient!} />;
}
