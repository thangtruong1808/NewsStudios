"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
import { ArrowPathIcon } from "@heroicons/react/24/outline";

/**
 * Interface for video query results with pagination metadata
 * @property data - Array of video objects or null
 * @property error - Error message or null
 * @property totalItems - Total number of videos (optional for search results)
 * @property totalPages - Total number of pages (optional for search results)
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
  const videosRef = useRef<Video[]>([]);

  // State management for videos list, loading states, and pagination
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);

  // Update ref when videos change
  useEffect(() => {
    videosRef.current = videos;
  }, [videos]);

  /**
   * Fetch videos with pagination and search support
   * Handles both initial load and infinite scroll
   * Manages loading states and error handling
   */
  const fetchVideos = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      try {
        const result = searchQuery
          ? await searchVideos(searchQuery)
          : await getVideos(currentPage, itemsPerPage);

        if (result.data) {
          if (currentPage === 1) {
            setVideos(result.data);
          } else {
            // Filter out any duplicates before appending
            const newVideos = result.data.filter(
              (video) => !videosRef.current.some((v) => v.id === video.id)
            );
            setVideos((prev) => [...prev, ...newVideos]);
          }

          const totalVideos = result.totalItems || 0;
          setTotalItems(totalVideos);

          // Calculate if there are more videos to load
          const currentTotal =
            currentPage === 1
              ? result.data.length
              : videosRef.current.length + result.data.length;
          setHasMore(currentTotal < totalVideos);
        } else {
          if (currentPage === 1) {
            setVideos([]);
            setTotalItems(0);
          }
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
        setIsRefreshing(false);
      }
    },
    [currentPage, itemsPerPage, searchQuery]
  );

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

  // Handle refreshing the videos list
  const handleRefresh = useCallback(() => {
    setCurrentPage(1);
    setSearchQuery("");
    setVideos([]);
    setTotalItems(0);
    setHasMore(true);
    fetchVideos(true);
  }, [fetchVideos]);

  // Effect to fetch videos when page changes
  useEffect(() => {
    fetchVideos(false);
  }, [currentPage, fetchVideos]);

  return (
    <div className="">
      {/* Header section with title and actions */}
      <VideosHeader />

      {/* Search bar for filtering videos */}
      <div className="mt-6 space-y-4">
        <VideosSearch onSearch={handleSearch} defaultValue={searchQuery} />
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

      {/* Videos grid with infinite scroll */}
      <div className="mt-6">
        <VideosGrid
          videos={videos}
          onEdit={handleEdit}
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
