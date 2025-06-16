export default function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      {/* Welcome Section Skeleton */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl p-4 text-white">
        <div className="flex justify-between items-start">
          <div>
            <div className="h-8 w-48 bg-white/20 rounded animate-pulse"></div>
            <div className="h-4 w-64 bg-white/20 rounded mt-2 animate-pulse"></div>
          </div>
          <div className="bg-white/10 rounded-lg p-2">
            <div className="h-5 w-5 bg-white/20 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="w-full">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-16 bg-gray-200 rounded mt-2 animate-pulse"></div>
                <div className="h-4 w-32 bg-gray-200 rounded mt-2 animate-pulse"></div>
              </div>
              <div className="bg-gray-100 p-2 rounded-lg">
                <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Overview Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-4">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-3"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-3"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-3"></div>
          <div className="h-[200px] bg-gray-100 rounded animate-pulse"></div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-3"></div>
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Skeleton */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-3"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center">
              <div className="w-2 h-2 bg-gray-200 rounded-full mr-2"></div>
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 