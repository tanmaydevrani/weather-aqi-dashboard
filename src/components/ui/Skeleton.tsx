import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-xl', className)}
      style={{ background: 'var(--border-strong)' }}
    />
  );
}

export function WeatherHeroSkeleton() {
  return (
    <div
      className="rounded-2xl p-7 space-y-4"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-14 w-14 rounded-2xl" />
      </div>
      <Skeleton className="h-20 w-44" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function AqiSkeleton() {
  return (
    <div
      className="rounded-2xl p-6 space-y-4"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <Skeleton className="h-5 w-28" />
      <div className="flex items-center gap-6">
        <Skeleton className="h-28 w-28 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
}

export function ForecastSkeleton() {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <Skeleton className="h-4 w-24 mb-4" />
      <div className="flex gap-2">
        {[...Array(7)].map((_, i) => (
          <Skeleton key={i} className="h-24 flex-1 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
