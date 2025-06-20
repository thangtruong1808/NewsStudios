"use client";

import { TagIcon } from "@heroicons/react/24/outline";

export default function TagsSkeleton() {
  // Create an array of 12 items to match ITEMS_PER_PAGE
  const skeletonItems = Array.from({ length: 12 }, (_, index) => index);

  return (
    <>
      {/* Header section with title and description - Full width background */}
      <div className="w-screen bg-gray-200 relative left-1/2 right-1/2 -mx-[50vw]">
        <div className="max-w-[1536px] mx-auto">
          <div className="py-8">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100">
                <TagIcon className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Popular Tags
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Explore articles by tags
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content section */}
      <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw]">
        <div className="max-w-[1536px] mx-auto px-6">
          <div className="mt-8">
            {/* Filters Skeleton */}
            <div className="mb-6 flex gap-4">
              <div className="flex-1">
                <div className="h-4 w-20 bg-gray-200 rounded mb-1 animate-pulse"></div>
                <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="flex-1">
                <div className="h-4 w-24 bg-gray-200 rounded mb-1 animate-pulse"></div>
                <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>

            {/* Total Tags Count Skeleton */}
            <div className="mb-4">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Tags Grid Skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {skeletonItems.map((index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-gray-200 bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button Skeleton */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm bg-gray-200 h-10 w-32 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
