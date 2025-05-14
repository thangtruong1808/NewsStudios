"use client";

export default function UsersTableSkeleton() {
  return (
    <div className="mt-8">
      <div className="animate-pulse">
        {/* Table header skeleton */}
        <div className="grid grid-cols-[50px_50px_150px_150px_200px_256px_100px_100px_128px_128px_150px] gap-4 py-3 px-4 bg-gray-50 border-b border-gray-200">
          <div className="h-4 bg-gray-200 rounded w-8"></div>
          <div className="h-4 bg-gray-200 rounded w-8"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>

        {/* Table rows skeleton */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[50px_50px_150px_150px_200px_256px_100px_100px_128px_128px_150px] gap-4 py-4 px-4 border-b border-gray-200"
          >
            <div className="h-4 bg-gray-200 rounded w-8"></div>
            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="flex space-x-2">
              <div className="h-8 w-16 bg-gray-200 rounded"></div>
              <div className="h-8 w-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}

        {/* Pagination skeleton */}
        <div className="flex justify-between items-center mt-4 px-4">
          <div className="h-8 bg-gray-200 rounded w-36"></div>
          <div className="h-8 bg-gray-200 rounded w-72"></div>
        </div>
      </div>
    </div>
  );
}
