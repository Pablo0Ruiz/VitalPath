'use client';

import Link from 'next/link';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import { cn } from '@/lib/utils';

type SidebarItemProps = {
  icon: IconSvgElement;
  label: string;
  href: string;
  active?: boolean;
};

const SidebarItem = ({ icon, label, href, active }: SidebarItemProps) => {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors border-l-2',
        active
          ? 'bg-brand-primary-50 text-brand-primary-700 border-brand-primary-600'
          : 'text-brand-text-secondary hover:bg-brand-neutral-100 hover:text-brand-text-primary border-transparent',
      )}
    >
      <HugeiconsIcon icon={icon} size={18} />
      <span>{label}</span>
    </Link>
  );
};

export default SidebarItem;
