"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getVideos, searchVideos } from "@/app/lib/actions/videos";
import { toast } from "react-hot-toast";
import VideosHeader from "@/app/components/dashboard/videos/header";
import VideosSearch from "@/app/components/dashboard/videos/search";
import { Video } from "@/app/lib/definition";

interface VideoResult {
  data: Video[];
  error: string | null;
  totalItems: number;
  totalPages: number;
}

export default function VideosPage() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      try {
        const result = searchQuery
          ? await searchVideos(searchQuery)
          : await getVideos();

        if (result.error) {
          toast.error(result.error);
          return;
        }

        const videoResult = result as VideoResult;
        if (currentPage === 1) {
          setVideos(videoResult.data);
        } else {
          setVideos((prev) => [...prev, ...videoResult.data]);
        }

        setTotalItems(videoResult.totalItems);
        setHasMore(videoResult.totalItems > currentPage * itemsPerPage);
      } catch (error) {
        console.error("Error fetching videos:", error);
        toast.error("Failed to fetch videos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [currentPage, itemsPerPage, searchQuery]);

  const handleSearch = (term: string) => {
    setSearchQuery(term);
    setCurrentPage(1);
    setVideos([]);
  };

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handleEdit = (video: Video) => {
    router.push(`/dashboard/videos/${video.id}/edit`);
  };

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
    <main>
      <div className="mb-8">
        <VideosHeader />
      </div>

      <div className="mb-8">
        <VideosSearch onSearch={handleSearch} defaultValue={searchQuery} />
      </div>

      <div className="mb-8">
        {videos.length === 0 && !isLoading ? (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl"
                >
                  {/* Video Container */}
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    <video
                      src={video.video_url}
                      className="w-full h-full object-cover"
                      controls
                    />
                  </div>

                  {/* Video Details */}
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-indigo-600">
                        Article ID: {video.article_id || "N/A"}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">
                          {new Date(video.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {video.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {video.description}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(video)}
                        className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
                        title="Edit video"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(video)}
                        className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                        title="Delete video"
                        disabled={isDeleting}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {hasMore && !isLoading && videos.length > 0 && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
