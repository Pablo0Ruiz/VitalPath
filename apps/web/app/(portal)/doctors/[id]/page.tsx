'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useDoctors, useCitasAdministrator } from '@repo/api-client';
import { useAuthStore } from '@repo/store';
import { formatLocalYMD } from '@/utils/format';

export default function DoctorDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: doctors, isLoading: loadingDoctors } = useDoctors();
  const { data: citas, isLoading: loadingCitas } = useCitasAdministrator();
  const role = useAuthStore(s => s.user?.role);

  const doctor = useMemo(() => doctors?.find(d => d._id === id), [doctors, id]);

  const today = formatLocalYMD(new Date());

  const todayCitas = useMemo(() => {
    if (!doctor) return [];
    return (citas ?? []).filter(
      c => c.fecha === today && c.medico_ID._id === doctor.user._id,
    );
  }, [citas, doctor, today]);

  if (loadingDoctors || loadingCitas) {
    return <p className="text-sm text-brand-text-secondary p-6">Cargando...</p>;
  }

  if (!doctor) {
    return (
      <p className="text-sm text-brand-text-secondary p-6">
        Doctor no encontrado.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto">
      <section className="rounded-2xl border border-brand-border p-6 flex flex-col gap-2">
        <h1 className="text-lg font-semibold text-brand-text-primary">
          {doctor.user.name} {doctor.user.lastName}
        </h1>
        <p className="text-sm text-brand-text-secondary">
          Especialidad:{' '}
          <span className="font-medium text-brand-text-primary">
            {doctor.especialidad}
          </span>
        </p>
        <p className="text-sm text-brand-text-secondary">
          Género:{' '}
          <span className="font-medium text-brand-text-primary">
            {doctor.user.genero}
          </span>
        </p>
        <p className="text-sm text-brand-text-secondary">
          Estado:{' '}
          <span className="font-medium text-brand-text-primary">
            {doctor.user.isActive ? 'Activo' : 'Inactivo'}
          </span>
        </p>
        {doctor.user.centroSalud_ID && (
          <p className="text-sm text-brand-text-secondary">
            Centro de salud:{' '}
            <span className="font-medium text-brand-text-primary">
              {doctor.user.centroSalud_ID.nombre}
            </span>
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-brand-border p-6 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-brand-text-primary">
            Horarios disponibles
          </h2>
          {role === 'admin' && (
            <Link
              href="/schedule"
              className="text-sm text-brand-primary hover:underline"
            >
              Editar horarios
            </Link>
          )}
        </div>
        {doctor.slots.length === 0 ? (
          <p className="text-sm text-brand-text-secondary">
            Sin horarios configurados.
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {doctor.slots.map(slot => (
              <li
                key={slot}
                className="text-xs font-medium px-3 py-1 rounded-full bg-brand-neutral-100 text-brand-text-primary"
              >
                {slot}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-brand-border p-6 flex flex-col gap-3">
        <h2 className="text-base font-semibold text-brand-text-primary">
          Citas de hoy
        </h2>
        {todayCitas.length === 0 ? (
          <p className="text-sm text-brand-text-secondary">
            No hay citas para este doctor hoy.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-brand-border">
            {todayCitas.map(c => (
              <li key={c._id} className="py-3 flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-brand-text-primary">
                  {c.paciente_ID.name} {c.paciente_ID.lastName}
                </span>
                <span className="text-xs text-brand-text-secondary">
                  {c.hora} — {c.estado}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
