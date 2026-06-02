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
        'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
        active
          ? 'bg-white/12 text-white font-semibold'
          : 'text-white/55 hover:bg-white/7 hover:text-white/85',
      )}
    >
      {active && (
        <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-brand-primary-400" />
      )}
      <HugeiconsIcon
        icon={icon}
        size={17}
        className={cn(active ? 'text-brand-primary-300' : 'text-white/45')}
      />
      <span>{label}</span>
    </Link>
  );
};

export default SidebarItem;
