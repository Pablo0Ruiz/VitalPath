'use client';

import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import {
  DashboardSquare02Icon,
  UserGroupIcon,
  Calendar03Icon,
  Medicine02Icon,
  RoboticIcon,
  UserAdd01Icon,
  CalendarAdd01Icon,
  Stethoscope02Icon,
  ChartLineData01Icon,
  InboxIcon,
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
    label: 'Citas',
    href: '/appointments',
    icon: Calendar03Icon,
    roles: ['medico', 'admin', 'trabajador_centro'],
  },
  {
    label: 'Medicamentos',
    href: '/medications',
    icon: Medicine02Icon,
    roles: ['medico'],
  },
  {
    label: 'Asistente IA',
    href: '/ai-assistant',
    icon: RoboticIcon,
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
    roles: ['admin', 'trabajador_centro'],
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
];

type SidebarProps = {
  role: Role;
  currentPath: string;
};

const Sidebar = ({ role, currentPath }: SidebarProps) => {
  const filtered = navItems.filter(item => item.roles.includes(role));

  return (
    <aside className="w-64 bg-brand-background border-r border-brand-border h-screen sticky top-0 flex flex-col">
      <div className="px-5 py-5 border-b border-brand-border flex items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-primary-600 flex items-center justify-center">
            <HugeiconsIcon icon={InboxIcon} size={14} className="text-white" />
          </div>
          <span className="text-base font-bold text-brand-text-primary tracking-tight">
            VitalPath
          </span>
        </div>
        <span className="text-xs font-medium bg-brand-primary-100 text-brand-primary-700 px-2 py-0.5 rounded-full">
          Portal
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
        {filtered.map(item => (
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
      </nav>

      <div className="px-4 py-3 border-t border-brand-border flex items-center justify-between">
        <span className="text-xs text-brand-neutral-400">v0.1.0</span>
        <a href="#" className="text-xs text-brand-primary-600 hover:underline">
          Ayuda
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
