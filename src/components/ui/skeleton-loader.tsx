/**
 * SkeletonLoader Component
 * Provides loading states for content
 */

export const SkeletonCard = () => (
  <div className="bg-card rounded-2xl p-6 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <div className="h-4 bg-muted rounded w-1/3 mb-2" />
        <div className="h-8 bg-muted rounded w-1/2" />
      </div>
      <div className="w-12 h-12 bg-muted rounded-full" />
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5 }: { rows?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 bg-card rounded-lg animate-pulse">
        <div className="w-10 h-10 bg-muted rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="h-3 bg-muted rounded w-1/3" />
        </div>
        <div className="h-8 w-24 bg-muted rounded" />
      </div>
    ))}
  </div>
);

export const SkeletonProfile = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-24 h-24 bg-muted rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-6 bg-muted rounded w-1/3" />
        <div className="h-4 bg-muted rounded w-1/2" />
      </div>
    </div>
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="h-10 bg-muted rounded w-full" />
        </div>
      ))}
    </div>
  </div>
);
