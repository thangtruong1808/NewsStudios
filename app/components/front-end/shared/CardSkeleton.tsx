"use client";

export default function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Image Skeleton */}
      <div className="aspect-[16/9] bg-gray-200 animate-pulse" />

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Title Skeleton */}
        <div className="h-6 bg-gray-200 rounded animate-pulse" />

        {/* Description Skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        </div>

        {/* Meta Information Skeleton */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Tags Skeleton */}
        <div className="flex flex-wrap gap-2 pt-2">
          <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-6 w-14 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
} 