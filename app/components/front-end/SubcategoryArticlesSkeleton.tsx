"use client";

import { FolderIcon } from "@heroicons/react/24/outline";
import { Grid, CardSkeleton } from "@/app/components/front-end/shared";

export default function SubcategoryArticlesSkeleton() {
  return (
    <>
      {/* Header Section Skeleton */}
      <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] m-8">
        <div className="max-w-[1536px] mx-auto px-6">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-100">
                <FolderIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <FolderIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Category:
                    </span>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <FolderIcon className="h-4 w-4 text-indigo-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Subcategory:
                    </span>
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">
                      Total Articles:
                    </span>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Grid Skeleton */}
      <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] mb-8">
        <div className="max-w-[1536px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-6">
            {Array.from({ length: 25 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>

      {/* Additional Spacing Section */}
      <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw]">
        <div className="max-w-[1536px] mx-auto px-6">
          <div style={{ paddingBottom: '2rem' }}></div>
        </div>
      </div>
    </>
  );
} 