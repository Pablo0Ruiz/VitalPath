import { HugeiconsIcon } from '@hugeicons/react';
import { UserIcon } from '@hugeicons/core-free-icons';
import Image from 'next/image';

import { cn, getInitials } from '@/lib/utils';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg';

type AvatarProps = {
  src?: string;
  name: string;
  size?: AvatarSize;
  className?: string;
};

const sizeMap: Record<AvatarSize, string> = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
};

const iconSizeMap: Record<AvatarSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
};

const Avatar = ({ src, name, size = 'md', className }: AvatarProps) => {
  const sizeClass = sizeMap[size];
  const iconSize = iconSizeMap[size];

  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        className={cn('rounded-full object-cover', sizeClass, className)}
      />
    );
  }

  const initials = getInitials(name);

  if (!initials) {
    return (
      <div
        className={cn(
          'rounded-full flex items-center justify-center bg-brand-primary-100 text-brand-primary-700',
          sizeClass,
          className,
        )}
      >
        <HugeiconsIcon icon={UserIcon} size={iconSize} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center bg-brand-primary-100 text-brand-primary-700 font-semibold select-none',
        sizeClass,
        className,
      )}
    >
      {initials}
    </div>
  );
};

export default Avatar;
