"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getVideos, searchVideos, deleteVideo } from "@/app/lib/actions/videos";
import VideosHeader from "@/app/components/dashboard/videos/header/index";
import VideosSearch from "@/app/components/dashboard/videos/search";
import VideosGrid from "@/app/components/dashboard/shared/grid/VideosGrid";
import { Video } from "@/app/lib/definition";
import {
  showConfirmationToast,
  showSuccessToast,
  showErrorToast,
} from "@/app/components/dashboard/shared/toast/Toast";

/**
 * Interface for video query results with pagination metadata
 * @property data - Array of video objects or null
 * @property error - Error message or null
 * @property totalItems - Total number of videos
 * @property totalPages - Total number of pages
 */
interface VideoResult {
  data: Video[] | null;
  error: string | null;
  totalItems?: number;
  totalPages?: number;
}

/**
 * VideosPage Component
 * Main page for managing videos with features for:
 * - Pagination and infinite scroll
 * - Search functionality
 * - Video grid display
 * - CRUD operations
 * - Loading states
 * - Error handling with toast notifications
 */
export default function VideosPage() {
  const router = useRouter();

  // State management for videos list, loading states, and pagination
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);

  /**
   * Fetch videos with pagination and search support
   * Handles both initial load and infinite scroll
   * Manages loading states and error handling
   */
  const fetchVideos = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log("Fetching videos with params:", {
        currentPage,
        itemsPerPage,
        searchQuery,
      });

      // Use searchVideos if search query exists, otherwise use getVideos with pagination
      const result = searchQuery
        ? await searchVideos(searchQuery)
        : await getVideos(currentPage, itemsPerPage);

      console.log("Received result:", {
        hasError: !!result.error,
        dataLength: result.data?.length,
        firstItem: result.data?.[0],
        totalItems: (result as VideoResult).totalItems,
      });

      if (result.error) {
        showErrorToast({ message: result.error });
        if (currentPage === 1) {
          setVideos([]);
          setTotalItems(0);
        }
        setHasMore(false);
        return;
      }

      // Update videos list based on pagination
      if (result.data && (result.data.length > 0 || currentPage === 1)) {
        if (currentPage === 1) {
          setVideos(result.data);
        } else {
          setVideos((prev) => [...prev, ...result.data!]);
        }
        // For search results, use the length of the data array as totalItems
        const totalItems =
          (result as VideoResult).totalItems || result.data.length;
        setTotalItems(totalItems);
        setHasMore(totalItems > currentPage * itemsPerPage);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      showErrorToast({ message: "Failed to fetch videos" });
      if (currentPage === 1) {
        setVideos([]);
        setTotalItems(0);
      }
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, searchQuery]);

  /**
   * Initialize and cleanup video fetching
   * Handles component mount/unmount lifecycle
   */
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      await fetchVideos();
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [fetchVideos]);

  /**
   * Handle search functionality
   * Resets pagination and triggers new search
   */
  const handleSearch = useCallback((term: string) => {
    setSearchQuery(term);
    setCurrentPage(1);
  }, []);

  /**
   * Load more videos for pagination
   * Increments current page to trigger fetch of next batch
   */
  const handleLoadMore = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
  }, []);

  /**
   * Navigate to edit page for a specific video
   * Routes to the edit form with video ID
   */
  const handleEdit = (video: Video) => {
    router.push(`/dashboard/videos/${video.id}/edit`);
  };

  /**
   * Delete video with confirmation
   * Handles API call, state updates, and error handling
   */
  const handleDelete = async (video: Video) => {
    const confirmPromise = new Promise<boolean>((resolve) => {
      showConfirmationToast({
        title: "Delete Video",
        message:
          "Are you sure you want to delete this video? This action cannot be undone.",
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });

    const isConfirmed = await confirmPromise;
    if (!isConfirmed) return;

    setIsDeleting(true);
    try {
      const result = await deleteVideo(video.id);

      if (!result.success) {
        throw new Error(result.error || "Failed to delete video");
      }

      showSuccessToast({ message: "Video deleted successfully" });
      setVideos((prev) => prev.filter((v) => v.id !== video.id));
      setTotalItems((prev) => prev - 1);
    } catch (error) {
      console.error("Error deleting video:", error);
      showErrorToast({
        message:
          error instanceof Error ? error.message : "Failed to delete video",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header section with title and actions */}
      <VideosHeader />

      {/* Search bar for filtering videos */}
      <VideosSearch onSearch={handleSearch} />

      <div className="mt-4">
        {/* Display total videos count */}
        <p className="text-sm mb-4">Total Videos: {totalItems}</p>

        {/* Empty state when no videos are found */}
        {videos.length === 0 && !isLoading && totalItems === 0 ? (
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
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No Videos Found
            </h3>
            <p className="rounded-md bg-gray-50 p-6 text-center text-red-500">
              {searchQuery
                ? "No videos match your search criteria."
                : "It seems the videos are not available. They might have been accidentally deleted from the storage."}
            </p>
          </div>
        ) : (
          <>
            {/* Video grid with edit and delete actions */}
            <VideosGrid
              videos={videos}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isLoading={isLoading}
            />

            {/* Load more button for pagination */}
            {hasMore && !isLoading && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="inline-flex justify-center rounded-md border border-transparent bg-gradient-to-r from-blue-600 to-blue-400 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
