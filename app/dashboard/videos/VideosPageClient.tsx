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

// Component Info
// Description: Manage dashboard videos listing with search, pagination, refresh, and admin actions.
// Date created: 2025-11-18
// Author: thangtruong
export default function VideosPageClient() {
  const router = useRouter();

  // State management for videos list, loading states, and pagination
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);

  // Update ref when videos change
  // Fetch videos with pagination and search
  const fetchVideos = useCallback(async () => {
    try {
      if (currentPage === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      const result = searchQuery
        ? await searchVideos(searchQuery)
        : await getVideos(currentPage, itemsPerPage);

      const videosData = Array.isArray(result.data) ? result.data : [];
      
      // Only show error toast for critical database errors, not for empty data
      if (result.error) {
        // Check if it's a critical database error that should be shown
        const isCriticalError = 
          result.error.includes("Failed to resolve table names") ||
          result.error.includes("doesn't exist") ||
          result.error.includes("SQL syntax");
        
        // Don't show toast for mysqld_stmt_execute errors when data is empty
        // This prevents false positive errors when table is empty
        if (isCriticalError && videosData.length > 0) {
          showErrorToast({
            message: result.error,
          });
        }
      }
      
      if (currentPage === 1) {
        setVideos(videosData);
      } else {
        setVideos((prev) => [...prev, ...videosData]);
      }

      setHasMore(videosData.length === itemsPerPage);
    } catch (error) {
      // Don't show error toast for empty table scenarios
      // Set empty data to show friendly empty state
      setVideos([]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [currentPage, itemsPerPage, searchQuery]);

  // Handle video deletion
  const handleDelete = useCallback(async ({ item }: { item: Video }) => {
    try {
      setIsDeleting(true);
      const confirmPromise = new Promise<boolean>((resolve) => {
        showConfirmationToast({
          title: "Delete Video",
          message: "Are you sure you want to delete this video?",
          onConfirm: () => resolve(true),
          onCancel: () => resolve(false),
        });
      });

      const confirmed = await confirmPromise;
      if (!confirmed) return;

      const result = await deleteVideo(item.id);
      if (result.error) {
        throw new Error(result.error);
      }

      setVideos((prev) => prev.filter((video) => video.id !== item.id));
      showSuccessToast({ message: "Video deleted successfully" });
    } catch (error) {
      showErrorToast({
        message: error instanceof Error ? error.message : "Failed to delete video",
      });
    } finally {
      setIsDeleting(false);
    }
  }, []);

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setCurrentPage(1);
    await fetchVideos();
    setIsRefreshing(false);
  };

  // Initialize and cleanup video fetching
  useEffect(() => {
    fetchVideos();
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
  const handleEdit = useCallback(
    ({ item }: { item: Video }) => {
      router.push(`/dashboard/videos/${item.id}/edit`);
    },
    [router]
  );

  return (
    <div className="">
      {/* Header section with title and actions */}
      <VideosHeader />

      {/* Search bar for filtering videos */}
      <div className="mt-6 space-y-4">
        <VideosSearch
          onSearch={({ term }) => handleSearch(term)}
          defaultValue={searchQuery}
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