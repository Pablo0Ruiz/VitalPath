import { HugeiconsIcon } from '@hugeicons/react';
import { InboxIcon, Tick02Icon } from '@hugeicons/core-free-icons';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen md:grid md:grid-cols-2">
      {/* Hero column — hidden on mobile */}
      <aside className="hidden md:flex flex-col justify-between p-12 bg-linear-to-br from-brand-primary-700 to-brand-primary-900 text-white">
        {/* Top — logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
            <HugeiconsIcon icon={InboxIcon} size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">VitalPath</span>
        </div>

        {/* Middle — tagline + benefits */}
        {/* TODO: product to refine post-pilot */}
        <div className="space-y-6 max-w-md">
          <h1 className="text-3xl font-bold leading-tight">
            Gestioná la salud de tus pacientes con inteligencia artificial
          </h1>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <HugeiconsIcon
                icon={Tick02Icon}
                size={18}
                className="text-teal-400 shrink-0 mt-0.5"
              />
              <span className="text-sm text-white/85">
                Historial clínico centralizado y seguro
              </span>
            </li>
            <li className="flex items-start gap-3">
              <HugeiconsIcon
                icon={Tick02Icon}
                size={18}
                className="text-teal-400 shrink-0 mt-0.5"
              />
              <span className="text-sm text-white/85">
                Asistente IA disponible en todo momento
              </span>
            </li>
            <li className="flex items-start gap-3">
              <HugeiconsIcon
                icon={Tick02Icon}
                size={18}
                className="text-teal-400 shrink-0 mt-0.5"
              />
              <span className="text-sm text-white/85">
                Citas y medicamentos en un solo lugar
              </span>
            </li>
          </ul>
        </div>

        {/* Bottom — doctor quote */}
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

      {/* Form column */}
      <main className="flex items-center justify-center p-8 bg-white min-h-screen md:min-h-0">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
