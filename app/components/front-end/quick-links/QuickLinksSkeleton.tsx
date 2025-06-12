export const QuickLinksSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Title Skeleton */}
      <div className="h-7 w-32 bg-gray-200 rounded animate-pulse mb-4" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Featured Button Skeleton */}
        <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-2 bg-gray-100 rounded-lg">
            <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Headlines Button Skeleton */}
        <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-2 bg-gray-100 rounded-lg">
            <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Trending Button Skeleton */}
        <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-2 bg-gray-100 rounded-lg">
            <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};
