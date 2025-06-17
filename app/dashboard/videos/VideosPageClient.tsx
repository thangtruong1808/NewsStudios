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
// interface VideoResult {
//   data: Video[] | null;
//   error: string | null;
//   totalItems?: number;
//   totalPages?: number;
// }

/**
 * VideosPageClient Component
 * Main page for managing videos with features for:
 * - Pagination and infinite scroll
 * - Search functionality
 * - Video grid display
 * - CRUD operations
 * - Loading states
 * - Error handling with toast notifications
 */
export default function VideosPageClient() {
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

  // Fetch videos with pagination and search
  const fetchVideos = useCallback(async () => {
    try {
      setIsLoadingMore(true);
      const result = searchQuery
        ? await searchVideos(searchQuery)
        : await getVideos(currentPage, itemsPerPage);

      if (result.error) {
        throw new Error(result.error);
      }

      if (currentPage === 1) {
        setVideos(result.data || []);
      } else {
        setVideos((prev) => [...prev, ...(result.data || [])]);
      }

      setTotalItems(result.totalItems || 0);
      setHasMore((result.data?.length || 0) === itemsPerPage);
    } catch (error) {
      console.error("Error fetching videos:", error);
      showErrorToast({ message: "Failed to load videos" });
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [currentPage, itemsPerPage, searchQuery]);

  // Handle video deletion
  const handleDelete = async (video: Video) => {
    try {
      setIsDeleting(true);
      const confirmPromise = new Promise<boolean>((resolve) => {
        showConfirmationToast({
          title: "Delete Video",
          message: "Are you sure you want to delete this video?",
          onConfirm: () => resolve(true),
          onCancel: () => resolve(false)
        });
      });

      const confirmed = await confirmPromise;
      if (!confirmed) return;

      const result = await deleteVideo(video.id);
      if (result.error) {
        throw new Error(result.error);
      }

      setVideos((prev) => prev.filter((v) => v.id !== video.id));
      showSuccessToast({ message: "Video deleted successfully" });
    } catch (error) {
      console.error("Error deleting video:", error);
      showErrorToast({ message: "Failed to delete video" });
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setCurrentPage(1);
    await fetchVideos();
    setIsRefreshing(false);
  };

  // Initialize and cleanup video fetching
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

  // Handle search functionality
  const handleSearch = useCallback((term: string) => {
    setSearchQuery(term);
    setCurrentPage(1);
  }, []);

  // Load more videos for pagination
  const handleLoadMore = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
  }, []);

  // Navigate to edit page for a specific video
  const handleEdit = (video: Video) => {
    router.push(`/dashboard/videos/${video.id}/edit`);
  };

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