import {
  Calendar03Icon,
  UserGroupIcon,
  Tick02Icon,
  Medicine02Icon,
} from '@hugeicons/core-free-icons';
import { StatCard } from '@/components/ui/molecules/StatCard';
import { PatientRow } from '@/components/ui/molecules/PatientRow';
import { Card } from '@/components/ui/atoms/Card';
import { StudyUploadModule } from '@/components/ui/organisms/StudyUploadModule';
import { ReportHistory } from '@/components/ui/organisms/ReportHistory';

const checkedInPatients = [
  {
    _id: '1',
    name: 'María',
    lastName: 'González',
    email: 'maria@email.com',
    checkinTime: '08:45',
    estado: 'activo',
  },
  {
    _id: '3',
    name: 'Ana',
    lastName: 'Martínez',
    email: 'ana@email.com',
    checkinTime: '09:10',
    estado: 'activo',
  },
  {
    _id: '4',
    name: 'Roberto',
    lastName: 'Fernández',
    email: 'roberto@email.com',
    checkinTime: '09:55',
    estado: 'activo',
  },
];

const DashboardDoctor = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={Calendar03Icon}
          value={8}
          label="Citas hoy"
          tone="brand"
        />
        <StatCard
          icon={UserGroupIcon}
          value={24}
          label="Mis pacientes"
          tone="neutral"
        />
        <StatCard
          icon={Tick02Icon}
          value={3}
          label="Check-in recibidos"
          tone="success"
        />
        <StatCard
          icon={Medicine02Icon}
          value={12}
          label="Recetas activas"
          tone="warning"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card padding="md" className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-brand-text-primary">
              Mis pacientes de hoy
            </h3>
            <div className="flex flex-col gap-3">
              {checkedInPatients.map(p => (
                <div
                  key={p._id}
                  className="flex items-center gap-3 p-3 bg-brand-neutral-50 rounded-xl border border-brand-border"
                >
                  <div className="flex-1 min-w-0">
                    <PatientRow
                      name={p.name}
                      lastName={p.lastName}
                      email={p.email}
                      estado={p.estado}
                    />
                  </div>
                  <span className="text-xs text-brand-text-secondary shrink-0">
                    Check-in {p.checkinTime}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <ReportHistory />
        </div>

        <div className="flex flex-col gap-4">
          <StudyUploadModule />
        </div>
      </div>
    </div>
  );
};

export default DashboardDoctor;
