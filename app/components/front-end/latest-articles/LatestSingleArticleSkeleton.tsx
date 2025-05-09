import React from "react";

export function LatestSingleArticleSkeleton() {
  return (
    <div className="w-full animate-pulse">
      {/* Header Skeleton */}
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Media Content Skeleton */}
        <div className="space-y-4 order-1">
          {/* Main Image Skeleton */}
          <div className="aspect-video bg-gray-200 rounded-lg"></div>

          {/* Additional Media Skeleton */}
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="aspect-square bg-gray-200 rounded"
              ></div>
            ))}
          </div>
        </div>

        {/* Text Content Skeleton */}
        <div className="space-y-4 order-2">
          {/* Content Skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>

          {/* Metadata Skeleton */}
          <div className="flex items-center gap-4">
            <div className="h-6 bg-gray-200 rounded w-24"></div>
            <div className="h-6 bg-gray-200 rounded w-32"></div>
          </div>

          {/* Info Skeleton */}
          <div className="flex items-center gap-4">
            <div className="h-8 bg-gray-200 rounded-full w-8"></div>
            <div className="h-4 bg-gray-200 rounded w-40"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
