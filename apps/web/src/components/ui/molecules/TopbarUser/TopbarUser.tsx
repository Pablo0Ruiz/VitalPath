'use client';

import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon, Logout03Icon } from '@hugeicons/core-free-icons';
import { Avatar } from '@/components/ui/atoms/Avatar';
import { Badge } from '@/components/ui/atoms/Badge';
import { cn } from '@/lib/utils';

type TopbarUserProps = {
  name: string;
  role: string;
};

const roleLabel: Record<string, string> = {
  medico: 'Médico',
  admin: 'Admin',
  trabajador_centro: 'Personal',
};

const TopbarUser = ({ name, role }: TopbarUserProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-brand-neutral-50 transition-colors"
      >
        <Avatar name={name} size="sm" />
        <div className="flex flex-col items-start gap-0.5">
          <span className="text-sm font-medium text-brand-text-primary leading-none">
            {name}
          </span>
          <Badge variant="brand" size="sm">
            {roleLabel[role] ?? role}
          </Badge>
        </div>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={16}
          className={cn(
            'text-brand-text-secondary transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-brand-background border border-brand-border rounded-xl shadow-(--brand-shadow-md) z-50 py-1">
          <button
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-brand-state-error hover:bg-brand-neutral-50 transition-colors"
            onClick={() => setOpen(false)}
          >
            <HugeiconsIcon icon={Logout03Icon} size={16} />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default TopbarUser;
