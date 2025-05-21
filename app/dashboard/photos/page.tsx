"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getImages, searchImages } from "@/app/lib/actions/images";
import PhotosHeader from "@/app/components/dashboard/photos/header";
import SearchBar from "@/app/components/dashboard/shared/search/SearchBar";
import PhotosGrid from "@/app/components/dashboard/shared/grid/PhotosGrid";
import { Image } from "@/app/lib/definition";
import {
  showSuccessToast,
  showErrorToast,
  showConfirmationToast,
} from "@/app/components/dashboard/shared/toast/Toast";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { deleteImage } from "@/app/lib/actions/images";

/**
 * PhotosPage Component
 * Main page for managing photos with features for:
 * - Infinite scroll pagination
 * - Search functionality
 * - CRUD operations (Create, Read, Update, Delete)
 * - Loading states and error handling
 * - Responsive grid layout
 */

// Interface for image data from database
interface ImageRow {
  id: number;
  article_id: number | null;
  image_url: string;
  description: string | null;
  type: "banner" | "video" | "thumbnail" | "gallery";
  entity_type: "advertisement" | "article" | "author" | "category";
  entity_id: number;
  is_featured: boolean;
  display_order: number;
  created_at: Date;
  updated_at: Date;
  article_title?: string;
}

// Interface for paginated API response
interface PaginatedResult {
  data: ImageRow[];
  error: string | null;
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

// Revalidate page data every 60 seconds
export const revalidate = 60;

// Helper function to convert database row to Image type
const convertImageRowToImage = (row: ImageRow): Image => ({
  ...row,
  created_at: row.created_at.toISOString(),
  updated_at: row.updated_at.toISOString(),
});

export default function PhotosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State management for photos list, loading states, and pagination
  const [photos, setPhotos] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fetch photos with pagination and search support
  const fetchPhotos = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      try {
        console.log("Fetching photos with params:", {
          currentPage,
          itemsPerPage,
          searchQuery,
        });

        const result = searchQuery
          ? await searchImages(searchQuery)
          : await getImages(currentPage, itemsPerPage);

        console.log("Received result:", {
          hasError: !!result.error,
          dataLength: result.data?.length,
          firstItem: result.data?.[0],
          pagination: result.pagination,
        });

        if (result.error) {
          showErrorToast({ message: result.error });
          if (currentPage === 1) {
            setPhotos([]);
            setTotalItems(0);
          }
          setHasMore(false);
          return;
        }

        const paginatedResult = result as PaginatedResult;
        const convertedPhotos = paginatedResult.data.map(
          convertImageRowToImage
        );

        console.log("Converted photos:", {
          count: convertedPhotos.length,
          firstPhoto: convertedPhotos[0],
        });

        // Update photos list based on pagination
        if (convertedPhotos.length > 0 || currentPage === 1) {
          if (currentPage === 1) {
            setPhotos(convertedPhotos);
          } else {
            setPhotos((prev) => [...prev, ...convertedPhotos]);
          }
          setTotalItems(paginatedResult.pagination.total);
          setHasMore(
            paginatedResult.pagination.total > currentPage * itemsPerPage
          );
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching photos:", error);
        showErrorToast({ message: "Failed to fetch photos" });
        if (currentPage === 1) {
          setPhotos([]);
          setTotalItems(0);
        }
        setHasMore(false);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [currentPage, itemsPerPage, searchQuery]
  );

  // Initialize and cleanup photo fetching
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      await fetchPhotos();
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [fetchPhotos]);

  // Search functionality handlers
  const handleSearch = useCallback((term: string) => {
    setSearchQuery(term);
    setCurrentPage(1);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setCurrentPage(1);
  }, []);

  // Load more photos for pagination
  const handleLoadMore = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
  }, []);

  // Refresh photos list
  const handleRefresh = useCallback(() => {
    setCurrentPage(1);
    fetchPhotos(true);
  }, [fetchPhotos]);

  // Navigate to edit page for a specific photo
  const handleEdit = (photo: Image) => {
    router.push(`/dashboard/photos/${photo.id}/edit`);
  };

  // Delete photo with confirmation
  const handleDelete = async (photo: Image) => {
    const confirmPromise = new Promise<boolean>((resolve) => {
      showConfirmationToast({
        title: "Delete Photo",
        message:
          "Are you sure you want to delete this photo? This action cannot be undone.",
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });

    const isConfirmed = await confirmPromise;
    if (!isConfirmed) return;

    setIsDeleting(true);
    try {
      const result = await deleteImage(photo.id);

      if (!result.success) {
        throw new Error(result.error || "Failed to delete photo");
      }

      showSuccessToast({ message: "Photo deleted successfully" });

      // Reset to first page and refresh data
      setCurrentPage(1);
      await fetchPhotos(true);
    } catch (error) {
      console.error("Error deleting photo:", error);
      showErrorToast({ message: "Failed to delete photo" });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    // px-4 sm:px-6 lg:px-8
    <div className="">
      {/* Header section with title and actions */}
      <PhotosHeader />

      {/* Search bar for filtering photos */}
      <div className="mt-6 space-y-4">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={handleSearch}
          placeholder="Search by photo description or article title..."
        />
        <div className="flex justify-end">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowPathIcon
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      <div className="mt-4">
        {/* Display total photos count */}
        <p className="text-sm text-gray-500 mb-4">Total Photos: {totalItems}</p>

        {/* Empty state when no photos are found */}
        {photos.length === 0 && !isLoading && totalItems === 0 ? (
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
              {searchQuery
                ? "No photos match your search criteria."
                : "It seems the photos are not available. They might have been accidentally deleted from the storage."}
            </p>
          </div>
        ) : (
          <>
            {/* Photos grid with loading state */}
            <PhotosGrid
              photos={photos}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isLoading={isLoading}
            />

            {/* Load More button */}
            {hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleLoadMore}
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
          </>
        )}
      </div>
    </div>
  );
}
