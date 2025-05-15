"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getVideos, searchVideos } from "@/app/lib/actions/videos";
import { toast } from "react-hot-toast";
import VideosHeader from "@/app/components/dashboard/videos/header/index";
import VideosSearch from "@/app/components/dashboard/videos/search";
import VideosGrid from "@/app/components/dashboard/shared/grid/VideosGrid";
import { Video } from "@/app/lib/definition";

// Interface for video query results
interface VideoResult {
  data: Video[] | null;
  error: string | null;
  totalItems?: number;
  totalPages?: number;
}

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

  // Fetch videos with pagination and search support
  const fetchVideos = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log("Fetching videos with params:", {
        currentPage,
        itemsPerPage,
        searchQuery,
      });

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
        toast.error(result.error);
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
      toast.error("Failed to fetch videos");
      if (currentPage === 1) {
        setVideos([]);
        setTotalItems(0);
      }
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, searchQuery]);

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

  // Delete video with confirmation
  const handleDelete = async (video: Video) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/videos/${video.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete video");
      }

      toast.success("Video deleted successfully");
      setVideos((prev) => prev.filter((v) => v.id !== video.id));
      setTotalItems((prev) => prev - 1);
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Failed to delete video");
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
        <p className="text-sm text-gray-500 mb-4">Total Videos: {totalItems}</p>

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
            <p className="text-gray-500">
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
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
