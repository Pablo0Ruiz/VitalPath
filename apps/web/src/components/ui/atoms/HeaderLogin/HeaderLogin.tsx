import { HugeiconsIcon } from '@hugeicons/react';
import { InboxIcon } from '@hugeicons/core-free-icons';

const HeaderLogin = () => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-brand-primary-500 to-brand-accent-ai flex items-center justify-center shadow-(--brand-shadow-md) mb-1">
        <HugeiconsIcon icon={InboxIcon} size={22} className="text-white" />
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <h1 className="text-xl font-bold text-brand-text-primary tracking-tight">
          Bienvenido a VitalPath
        </h1>
        <p className="text-sm text-brand-text-secondary">
          Ingresá al portal médico
        </p>
      </div>
    </div>
  );
};

export default HeaderLogin;
