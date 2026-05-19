'use client';

import { usePathname } from 'next/navigation';
import { useAuthStore } from '@repo/store';
import { Sidebar } from '@/components/ui/organisms/Sidebar';
import { Topbar } from '@/components/ui/organisms/Topbar';
import { SessionGate } from '@/components/SessionGate';
import FloatingChat from '@/components/ui/organisms/FloatingChat';

const pathLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/patients': 'Pacientes',
  '/appointments': 'Citas',
  '/register-patient': 'Registro paciente',
  '/schedule': 'Agendar',
  '/doctors': 'Médicos',
  '/reports': 'Reportes',
  '/audit-logs': 'Auditoría',
};

const dynamicPatterns: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /^\/patients\/[a-f0-9]{24}$/, label: 'Paciente' },
];

function resolvePathLabel(pathname: string): string {
  if (pathLabels[pathname]) return pathLabels[pathname];
  for (const { pattern, label } of dynamicPatterns) {
    if (pattern.test(pathname)) return label;
  }
  return 'Portal';
}

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const pageLabel = resolvePathLabel(pathname);

  const isPatientDetailPage = /^\/patients\/[a-f0-9]{24}$/.test(pathname);
  const breadcrumbs = isPatientDetailPage
    ? [
        { label: 'VitalPath', href: '/dashboard' },
        { label: 'Pacientes', href: '/patients' },
        { label: pageLabel },
      ]
    : [{ label: 'VitalPath', href: '/dashboard' }, { label: pageLabel }];

  const role = (user?.role ?? 'medico') as
    | 'medico'
    | 'admin'
    | 'trabajador_centro';

  return (
    <SessionGate>
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          role={role}
          currentPath={pathname}
          user={{
            name: user?.name ?? 'Usuario',
            lastName: user?.lastName,
            role,
          }}
        />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Topbar
            breadcrumbs={breadcrumbs}
            user={{ name: user?.name ?? '', role }}
          />
          <main className="flex-1 overflow-y-auto bg-brand-neutral-50 p-6 min-h-[calc(100vh-4rem)]">
            {children}
          </main>
          <FloatingChat />
        </div>
      </div>
    </SessionGate>
  );
}
