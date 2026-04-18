'use client';

import { usePathname } from 'next/navigation';
import { useAuthStore } from '@repo/store';
import { Sidebar } from '@/components/ui/organisms/Sidebar';
import { Topbar } from '@/components/ui/organisms/Topbar';
import { SessionGate } from '@/components/SessionGate';

const pathLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/patients': 'Pacientes',
  '/appointments': 'Citas',
  '/medications': 'Medicamentos',
  '/ai-assistant': 'Asistente IA',
  '/register-patient': 'Registro paciente',
  '/schedule': 'Agendar',
  '/doctors': 'Médicos',
  '/reports': 'Reportes',
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const pageLabel = pathLabels[pathname] ?? 'Portal';

  const role = (user?.role ?? 'medico') as
    | 'medico'
    | 'admin'
    | 'trabajador_centro';

  return (
    <SessionGate>
      <div className="flex h-screen overflow-hidden">
        <Sidebar role={role} currentPath={pathname} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Topbar
            breadcrumbs={[
              { label: 'VitalPath', href: '/dashboard' },
              { label: pageLabel },
            ]}
            user={{ name: user?.name ?? '', role }}
          />
          <main className="flex-1 overflow-y-auto bg-brand-neutral-50 p-6 min-h-[calc(100vh-4rem)]">
            {children}
          </main>
        </div>
      </div>
    </SessionGate>
  );
}
