import { HugeiconsIcon } from '@hugeicons/react';
import { InboxIcon, Tick02Icon } from '@hugeicons/core-free-icons';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen md:grid md:grid-cols-2">
      <aside className="hidden md:flex flex-col justify-between p-12 bg-linear-to-br from-[#0D1B3E] via-brand-primary-900 to-[#060d1f] text-white relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-brand-primary-500/20 blur-3xl" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 backdrop-blur flex items-center justify-center">
            <HugeiconsIcon icon={InboxIcon} size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">VitalPath</span>
        </div>
        <div className="space-y-6 max-w-md">
          <h1 className="text-3xl font-bold leading-tight">
            Gestioná la salud de tus pacientes con inteligencia artificial
          </h1>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <HugeiconsIcon
                icon={Tick02Icon}
                size={18}
                className="text-brand-secondary-400 shrink-0 mt-0.5"
              />
              <span className="text-sm text-white/85">
                Historial clínico centralizado y seguro
              </span>
            </li>
            <li className="flex items-start gap-3">
              <HugeiconsIcon
                icon={Tick02Icon}
                size={18}
                className="text-brand-secondary-400 shrink-0 mt-0.5"
              />
              <span className="text-sm text-white/85">
                Asistente IA disponible en todo momento
              </span>
            </li>
            <li className="flex items-start gap-3">
              <HugeiconsIcon
                icon={Tick02Icon}
                size={18}
                className="text-brand-secondary-400 shrink-0 mt-0.5"
              />
              <span className="text-sm text-white/85">
                Citas y medicamentos en un solo lugar
              </span>
            </li>
          </ul>
        </div>
        <figure className="border-l-2 border-white/30 pl-4 max-w-md">
          <blockquote className="text-sm italic text-white/85 leading-relaxed">
            &ldquo;VitalPath me ahorra horas de trabajo administrativo cada
            semana.&rdquo;
          </blockquote>
          <figcaption className="text-xs text-white/60 mt-2">
            — Dra. García, Medicina General
          </figcaption>
        </figure>
      </aside>
      <main className="flex items-center justify-center p-8 bg-brand-background min-h-screen md:min-h-0">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
