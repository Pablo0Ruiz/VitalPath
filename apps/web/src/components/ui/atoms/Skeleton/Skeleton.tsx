import { cn } from '@/lib/utils';

type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  width?: string;
  height?: string;
};

const Skeleton = ({ className, ...props }: SkeletonProps) => {
  return (
    <div
      className={cn('animate-pulse bg-brand-neutral-200 rounded-md', className)}
      {...props}
    />
  );
};

export default Skeleton;
