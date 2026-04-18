import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { TopbarUser } from '@/components/ui/molecules/TopbarUser';

type Breadcrumb = {
  label: string;
  href?: string;
};

type TopbarProps = {
  breadcrumbs: Breadcrumb[];
  user: {
    name: string;
    role: string;
  };
};

const Topbar = ({ breadcrumbs, user }: TopbarProps) => {
  return (
    <header className="h-16 bg-brand-background border-b border-brand-border px-6 flex items-center justify-between shrink-0">
      <nav className="flex items-center gap-1.5">
        {breadcrumbs.map((crumb, i) => (
          <div key={i} className="flex items-center gap-1.5">
            {i > 0 && (
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={14}
                className="text-brand-neutral-400"
              />
            )}
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="text-sm text-brand-text-secondary hover:text-brand-text-primary transition-colors"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-sm font-semibold text-brand-text-primary">
                {crumb.label}
              </span>
            )}
          </div>
        ))}
      </nav>
      <TopbarUser name={user.name} role={user.role} />
    </header>
  );
};

export default Topbar;
