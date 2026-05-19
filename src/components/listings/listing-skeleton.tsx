export function ListingSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-200 bg-white">
      <div className="aspect-[4/3] bg-gray-200 rounded-t-xl" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-24 bg-gray-200 rounded" />
        <div className="h-5 w-48 bg-gray-200 rounded" />
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="h-6 w-20 bg-gray-200 rounded" />
          <div className="space-y-1">
            <div className="h-3 w-16 bg-gray-200 rounded" />
            <div className="h-3 w-14 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ListingSkeletonGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <ListingSkeleton key={i} />
      ))}
    </div>
  );
}
