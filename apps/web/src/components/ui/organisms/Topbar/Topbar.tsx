import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { TopbarUser } from '@/components/ui/molecules/TopbarUser';

type Breadcrumb = { label: string; href?: string };
type TopbarProps = {
  breadcrumbs: Breadcrumb[];
  user: { name: string; role: string };
};

const Topbar = ({ breadcrumbs, user }: TopbarProps) => {
  const pageTitle = breadcrumbs[breadcrumbs.length - 1]?.label ?? 'Portal';
  const parentCrumbs = breadcrumbs.slice(0, -1);

  return (
    <header className="bg-brand-surface border-b border-brand-border shrink-0 shadow-(--brand-shadow-sm)">
      <div className="px-6 h-14 flex items-center justify-between">
        <nav className="flex items-center gap-1.5">
          {parentCrumbs.map((crumb, i) => (
            <div key={i} className="flex items-center gap-1.5">
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="text-xs text-brand-text-secondary hover:text-brand-primary-600 transition-colors font-medium"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-xs text-brand-text-secondary">
                  {crumb.label}
                </span>
              )}
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={12}
                className="text-brand-neutral-300"
              />
            </div>
          ))}
          <h1 className="text-sm font-bold text-brand-text-primary">
            {pageTitle}
          </h1>
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline-flex items-center text-xs font-medium text-brand-text-secondary bg-brand-background px-3 py-1.5 rounded-full border border-brand-border">
            {new Date().toLocaleDateString('es-AR', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
            })}
          </span>
          <TopbarUser name={user.name} role={user.role} />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
