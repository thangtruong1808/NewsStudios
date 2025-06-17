"use client";

import { FireIcon } from "@heroicons/react/24/outline";

export default function ArticlesTrendingSkeleton() {
  // Create arrays for skeleton items
  const carouselItems = Array.from({ length: 7 }, (_, index) => index);
  const gridItems = Array.from({ length: 10 }, (_, index) => index);

  return (
    <>
      {/* Header section with title and description - Full width background */}
      <div className="w-screen bg-gray-200 relative left-1/2 right-1/2 -mx-[50vw]">
        <div className="max-w-[1536px] mx-auto">
          <div className="py-8">
            <div className="flex items-center space-x-3 pl-4 lg:pl-0">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-red-100">
                <FireIcon className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Trending Articles
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  What&apos;s hot and happening right now
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content section */}
      <div className="max-w-[1536px] mx-auto px-4 py-8">
        {/* Image Carousel Section Skeleton */}
        <div className="mb-4 h-[400px] w-full">
          <div className="w-full h-full bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        {/* Articles Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {gridItems.map((index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {/* Image Skeleton */}
              <div className="w-full h-48 bg-gray-200 animate-pulse"></div>

              {/* Content Skeleton */}
              <div className="p-4">
                {/* Title Skeleton */}
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-3"></div>

                {/* Description Skeleton */}
                <div className="space-y-2 mb-4">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* Meta Info Skeleton */}
                <div className="flex items-center justify-between mb-3">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* Tags Skeleton */}
                <div className="flex gap-2 mb-3">
                  <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* Stats Skeleton */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button Skeleton */}
        <div className="flex justify-center mt-8">
          <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </>
  );
}
