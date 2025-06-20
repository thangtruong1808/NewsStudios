"use client";

import { DocumentTextIcon } from "@heroicons/react/24/outline";

export default function RelativeArticlesInSingleArticleSkeleton() {
  // Create array for skeleton items
  const gridItems = Array.from({ length: 8 }, (_, index) => index);

  return (
    <>
      {/* Header section with title and description - Full width background */}
      <div className="w-screen bg-gray-200 relative left-1/2 right-1/2 -mx-[50vw]">
        <div className="max-w-[1536px] mx-auto">
          <div className="py-8">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-100">
                <svg
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Related Articles
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Discover more articles you might be interested in
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content section */}
      <div className="space-y-8 mt-8">
        <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw]">
          <div className="max-w-[1536px] mx-auto px-6">
            {/* Grid layout for relative articles skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-6">
              {gridItems.map((index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Article image skeleton */}
                  <div className="relative h-48">
                    <div className="w-full h-full bg-gray-200 animate-pulse"></div>
                  </div>

                  {/* Article content skeleton */}
                  <div className="p-4">
                    {/* Category and subcategory badges skeleton */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-6 w-28 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>

                    {/* Title skeleton */}
                    <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>

                    {/* Description skeleton */}
                    <div className="space-y-2 mb-4">
                      <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
                    </div>

                    {/* Article metadata skeleton */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <div className="h-4 w-4 mr-1 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="flex items-center">
                          <div className="h-4 w-4 mr-1 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="flex items-center">
                          <div className="h-4 w-4 mr-1 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="h-4 w-4 mr-1 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>

                    {/* Date skeleton */}
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <div className="h-4 w-4 mr-1 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                    </div>

                    {/* Tags section skeleton */}
                    <div className="mt-4">
                      <div className="h-4 w-12 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="flex flex-wrap gap-2">
                        <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-6 w-18 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More button skeleton */}
            <div className="flex justify-center mt-8">
              <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
