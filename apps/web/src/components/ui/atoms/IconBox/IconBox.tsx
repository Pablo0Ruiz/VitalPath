import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { iconBoxVariants } from './IconBox.variants';

const iconSizeMap = {
  sm: 16,
  md: 20,
  lg: 24,
};

type IconBoxProps = VariantProps<typeof iconBoxVariants> & {
  icon: IconSvgElement;
  className?: string;
};

const IconBox = ({ icon, tone, size = 'md', className }: IconBoxProps) => {
  return (
    <div className={cn(iconBoxVariants({ tone, size }), className)}>
      <HugeiconsIcon icon={icon} size={iconSizeMap[size ?? 'md']} />
    </div>
  );
};

export default IconBox;
