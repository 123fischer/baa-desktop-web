import { cn } from '@/utils/utlis';

const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-neutral-100', className)}
      {...props}
    />
  );
};

export { Skeleton };
