export function ProductCardSkeleton() {
  return (
    <div className="border-surface-border flex flex-col overflow-hidden rounded-lg border bg-white">
      <div className="bg-surface-muted aspect-square w-full animate-pulse" />
      <div className="flex flex-col gap-2 p-4">
        <div className="bg-surface-muted h-3 w-16 animate-pulse rounded" />
        <div className="bg-surface-muted h-4 w-full animate-pulse rounded" />
        <div className="bg-surface-muted h-4 w-2/3 animate-pulse rounded" />
        <div className="bg-surface-muted h-5 w-20 animate-pulse rounded" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
