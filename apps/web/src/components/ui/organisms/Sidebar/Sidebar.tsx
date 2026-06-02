'use client';

import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import {
  DashboardSquare02Icon,
  UserGroupIcon,
  Calendar03Icon,
  UserAdd01Icon,
  CalendarAdd01Icon,
  Stethoscope02Icon,
  ChartLineData01Icon,
  InboxIcon,
  Audit01Icon,
} from '@hugeicons/core-free-icons';
import { SidebarItem } from '@/components/ui/molecules/SidebarItem';

type Role = 'medico' | 'admin' | 'trabajador_centro';

type NavItem = {
  label: string;
  href: string;
  icon: IconSvgElement;
  roles: Role[];
};

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: DashboardSquare02Icon,
    roles: ['medico', 'admin', 'trabajador_centro'],
  },
  {
    label: 'Pacientes',
    href: '/patients',
    icon: UserGroupIcon,
    roles: ['medico'],
  },
  {
    label: 'Pacientes del centro',
    href: '/center-patients',
    icon: UserGroupIcon,
    roles: ['admin', 'trabajador_centro'],
  },
  {
    label: 'Citas',
    href: '/appointments',
    icon: Calendar03Icon,
    roles: ['medico', 'admin', 'trabajador_centro'],
  },
  {
    label: 'Registro paciente',
    href: '/register-patient',
    icon: UserAdd01Icon,
    roles: ['admin', 'trabajador_centro'],
  },
  {
    label: 'Agendar',
    href: '/schedule',
    icon: CalendarAdd01Icon,
    roles: ['admin'],
  },
  {
    label: 'Médicos',
    href: '/doctors',
    icon: Stethoscope02Icon,
    roles: ['admin', 'trabajador_centro'],
  },
  {
    label: 'Reportes',
    href: '/reports',
    icon: ChartLineData01Icon,
    roles: ['admin', 'trabajador_centro'],
  },
  {
    label: 'Auditoría',
    href: '/audit-logs',
    icon: Audit01Icon,
    roles: ['admin'],
  },
];

const sections = [
  {
    title: 'CLÍNICO',
    labels: ['Dashboard', 'Pacientes', 'Pacientes del centro', 'Citas'],
  },
  { title: 'HERRAMIENTAS', labels: ['Registro paciente', 'Agendar'] },
  { title: 'GESTIÓN', labels: ['Médicos', 'Reportes', 'Auditoría'] },
];

const roleLabelMap: Record<Role, string> = {
  medico: 'Médico/a',
  admin: 'Administrador/a',
  trabajador_centro: 'Personal del centro',
};

type SidebarProps = {
  role: Role;
  currentPath: string;
  user: { name: string; lastName?: string; role?: Role };
};

const Sidebar = ({ role, currentPath, user }: SidebarProps) => {
  const filtered = navItems.filter(item => item.roles.includes(role));
  const initials = (
    (user.name[0] ?? '') + (user.lastName?.[0] ?? '')
  ).toUpperCase();
  const roleLabel = user.role ? roleLabelMap[user.role] : roleLabelMap[role];

  return (
    <aside className="w-64 h-screen sticky top-0 flex flex-col bg-[#0D1B3E] border-r border-white/8">
      <div className="px-5 py-5 border-b border-white/10 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-linear-to-br from-brand-primary-400 to-brand-accent-ai flex items-center justify-center shadow-lg">
          <HugeiconsIcon icon={InboxIcon} size={15} className="text-white" />
        </div>
        <span className="text-base font-bold text-white tracking-tight">
          VitalPath
        </span>
        <span className="text-[10px] font-semibold bg-white/10 text-white/70 px-2 py-0.5 rounded-full border border-white/10">
          Portal
        </span>
      </div>

      <div className="px-4 py-3.5 border-b border-white/10 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-linear-to-br from-brand-primary-400 to-brand-accent-ai text-white flex items-center justify-center text-sm font-bold shrink-0 ring-2 ring-white/20">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            {user.name}
            {user.lastName ? ` ${user.lastName}` : ''}
          </p>
          <p className="text-xs text-white/50 capitalize">{roleLabel}</p>
        </div>
      </div>

      {/* Nav */}
      <nav
        aria-label="Navegación principal"
        className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-0.5"
      >
        {sections.map((section, idx) => {
          const sectionItems = filtered.filter(item =>
            section.labels.includes(item.label),
          );
          if (sectionItems.length === 0) return null;
          return (
            <div key={section.title}>
              {idx > 0 && <div className="h-px bg-white/8 mx-1 my-2" />}
              <p className="px-3 pt-3 pb-1.5 text-[10px] font-semibold tracking-widest text-white/35 uppercase">
                {section.title}
              </p>
              <div className="flex flex-col gap-0.5">
                {sectionItems.map(item => (
                  <SidebarItem
                    key={item.href}
                    icon={item.icon}
                    label={item.label}
                    href={item.href}
                    active={
                      currentPath === item.href ||
                      currentPath.startsWith(item.href + '/')
                    }
                  />
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between">
        <span className="text-[11px] text-white/30">v0.1.0</span>
        <a
          href="#"
          className="text-[11px] text-white/40 hover:text-white/70 transition-colors"
        >
          Ayuda
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
