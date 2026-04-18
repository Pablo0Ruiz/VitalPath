'use client';
import { DashboardDoctor } from '@/components/ui/organisms/DashboardDoctor';
import { DashboardAdmin } from '@/components/ui/organisms/DashboardAdmin';
import { useAuthStore } from '@repo/store';

export default function DashboardPage() {
  const user = useAuthStore(state => state.user);
  return (
    <>{user?.role === 'medico' ? <DashboardDoctor /> : <DashboardAdmin />}</>
  );
}
