"use client";

import { Image } from "@/app/lib/definition";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { PhotoCard } from "@/app/components/dashboard/photos/card/PhotoCard";

interface PhotosGridProps {
  photos: Image[];
  onEdit: (photo: Image) => void;
  onDelete: (photo: Image) => void;
  isLoading?: boolean;
  isDeleting?: boolean;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
}

export default function PhotosGrid({
  photos,
  onEdit,
  onDelete,
  isLoading = false,
  isDeleting = false,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
}: PhotosGridProps) {
  // Loading skeleton UI
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {[...Array(12)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse"
          >
            <div className="w-full h-48 bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="flex justify-end space-x-2">
                <div className="h-8 w-8 bg-gray-200 rounded" />
                <div className="h-8 w-8 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state when no photos are found
  if (photos.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-2">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No Photos Found
        </h3>
        <p className="text-gray-500">
          It seems the photos are not available. They might have been
          accidentally deleted from the storage.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            onEdit={onEdit}
            onDelete={onDelete}
            isDeleting={isDeleting}
          />
        ))}
      </div>

      {/* Load More button */}
      {hasMore && onLoadMore && (
        <div className="flex justify-center">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-400 px-5 py-2 text-sm font-medium text-white transition-colors hover:from-blue-700 hover:to-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingMore ? (
              <>
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <ArrowPathIcon className="h-5 w-5" />
                Load More
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
