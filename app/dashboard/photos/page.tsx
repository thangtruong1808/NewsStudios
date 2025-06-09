"use client";

import { usePhotos } from "@/app/components/dashboard/photos/hooks/usePhotos";
import PhotosGrid from "@/app/components/dashboard/shared/grid/PhotosGrid";
import { useState } from "react";
import { Image } from "@/app/lib/definition";
import { SearchWrapper } from "@/app/components/dashboard/shared/search";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import PhotosHeader from "@/app/components/dashboard/photos/header/PhotosHeader";
import { useRouter } from "next/navigation";

/**
 * PhotosPage Component
 * Main page for managing photos with features for:
 * - Infinite scroll pagination
 * - Search functionality
 * - CRUD operations (Create, Read, Update, Delete)
 * - Loading states and error handling
 * - Responsive grid layout
 */
export default function PhotosPage() {
  const router = useRouter();
  const {
    photos,
    isLoading,
    isDeleting,
    hasMore,
    isLoadingMore,
    searchQuery,
    handleSearch,
    handleLoadMore,
    handleRefresh,
    handleDelete,
  } = usePhotos();

  const handleEditClick = (photo: Image) => {
    router.push(`/dashboard/photos/${photo.id}/edit`);
  };

  return (
    <div className="">
      {/* Header section with title and create button */}
      <PhotosHeader />

      {/* Search functionality */}
      <div className="my-6">
        <div className="w-full">
          <SearchWrapper
            placeholder="Search by photo description, article ID or title..."
            onSearch={handleSearch}
            defaultValue={searchQuery}
          />
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Photos grid with infinite scroll */}
      <div className="mt-6">
        <PhotosGrid
          photos={photos}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          isLoading={isLoading}
          isDeleting={isDeleting}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={handleLoadMore}
        />
      </div>
    </div>
  );
}
