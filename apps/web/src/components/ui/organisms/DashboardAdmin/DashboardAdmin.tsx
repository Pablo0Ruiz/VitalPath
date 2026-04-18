'use client';

import { useState } from 'react';
import {
  UserGroupIcon,
  Calendar03Icon,
  Stethoscope02Icon,
  Tick02Icon,
  Search01Icon,
} from '@hugeicons/core-free-icons';
import { StatCard } from '@/components/ui/molecules/StatCard';
import { Input } from '@/components/ui/atoms/Input';
import { CheckInTable } from '@/components/ui/organisms/CheckInTable';
import { CenterCodePanel } from '@/components/ui/organisms/CenterCodePanel';

const DashboardAdmin = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={UserGroupIcon}
          value={143}
          label="Pacientes activos"
          tone="brand"
        />
        <StatCard
          icon={Calendar03Icon}
          value={31}
          label="Citas hoy"
          tone="neutral"
        />
        <StatCard
          icon={Stethoscope02Icon}
          value={8}
          label="Médicos activos"
          tone="success"
        />
        <StatCard
          icon={Tick02Icon}
          value={5}
          label="Check-ins pendientes"
          tone="warning"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Buscar paciente..."
                leftIcon={Search01Icon}
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearch(e.target.value)
                }
              />
            </div>
          </div>
          <CheckInTable />
        </div>

        <div>
          <CenterCodePanel />
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
