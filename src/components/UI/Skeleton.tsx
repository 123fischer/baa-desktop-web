import { cn } from '@/utils/utlis';

const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-neutral', className)}
      {...props}
    />
  );
};

export { Skeleton };
