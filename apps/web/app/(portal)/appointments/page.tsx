'use client';

import { useAuthStore } from '@repo/store';
import AdminAppointmentsView from './AdminAppointmentsView';
import MedicoAppointmentsView from './MedicoAppointmentsView';

export default function AppointmentsPage() {
  const role = useAuthStore(s => s.user)?.role;
  return role === 'medico' ? (
    <MedicoAppointmentsView />
  ) : (
    <AdminAppointmentsView />
  );
}
