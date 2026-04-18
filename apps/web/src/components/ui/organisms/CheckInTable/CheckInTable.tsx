'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/atoms/Badge';
import { Button } from '@/components/ui/atoms/Button';
import { Card } from '@/components/ui/atoms/Card';
import { mockCheckIns } from '@/lib/mock-data';

type CheckIn = (typeof mockCheckIns)[number] & { checked?: boolean };

const CheckInTable = () => {
  const [rows, setRows] = useState<CheckIn[]>(mockCheckIns);

  function handleCheckIn(id: string) {
    setRows(prev =>
      prev.map(r => (r._id === id ? { ...r, estado: 'asistido' } : r)),
    );
  }

  return (
    <Card padding="none" className="flex flex-col gap-0 overflow-hidden">
      <div className="px-5 py-4 border-b border-brand-border">
        <h3 className="text-sm font-semibold text-brand-text-primary">
          Agenda del día
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-brand-neutral-50 border-b border-brand-border">
              {['Hora', 'Paciente', 'Médico', 'Estado', 'Acción'].map(h => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold text-brand-text-secondary uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr
                key={row._id}
                className="border-b border-brand-border last:border-0 hover:bg-brand-neutral-50 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-brand-text-primary">
                  {row.hora}
                </td>
                <td className="px-4 py-3 text-brand-text-primary">
                  {row.patientName}
                </td>
                <td className="px-4 py-3 text-brand-text-secondary">
                  {row.doctorName}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant={row.estado === 'asistido' ? 'success' : 'warning'}
                    size="sm"
                  >
                    {row.estado === 'asistido' ? 'Asistido' : 'Pendiente'}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  {row.estado === 'pendiente' ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleCheckIn(row._id)}
                    >
                      Check-in
                    </Button>
                  ) : (
                    <Badge variant="success" size="sm">
                      Asistido
                    </Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default CheckInTable;
