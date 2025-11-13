"use client";

import { Video } from "@/app/lib/definition";
import {
  PencilIcon,
  TrashIcon,
  ClockIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { formatDateToLocal } from "@/app/lib/utils/dateFormatter";

// Props interface for VideosGrid component
interface VideosGridProps {
  videos: Video[]; // Array of video objects to display
  onEdit: (_payload: { item: Video }) => void; // Callback for edit action
  onDelete: (_payload: { item: Video }) => Promise<void>; // Callback for delete action
  isLoading?: boolean; // Loading state indicator
  isDeleting?: boolean; // Deleting state indicator
  hasMore?: boolean; // Whether there are more videos to load
  isLoadingMore?: boolean; // Loading state for pagination
  onLoadMore?: () => void; // Callback for loading more videos
}

// Description: Render dashboard video cards with admin controls, skeletons, and load-more support.
// Data created: 2024-11-13
// Author: thangtruong
export default function VideosGrid({
  videos,
  onEdit,
  onDelete,
  isLoading = false,
  isDeleting = false,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
}: VideosGridProps) {
  // State to track deletion process
  const [isDeletingLocal, setIsDeletingLocal] = useState(false);
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  // Handle video deletion with confirmation
  const handleDelete = async (video: Video) => {
    setIsDeletingLocal(true);
    try {
      await onDelete({ item: video });
    } catch (error) {
      throw error; // Re-throw so parent can surface feedback
    } finally {
      setIsDeletingLocal(false);
    }
  };

  // Loading skeleton UI
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(12)].map((_, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <div className="relative aspect-[4/3]">
                <div className="w-full h-full bg-gray-200 animate-pulse" />
              </div>
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state when no videos are found
  if (videos.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-2">
          <svg
            className="mx-auto h-12 w-12 text-red-400"
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
        <h3 className="text-lg font-medium text-red-500 mb-1">
          No Videos Found
        </h3>
        <p className="text-red-500">
          It seems the videos are not available. They might have been
          accidentally deleted from the storage.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {videos.map((video) => (
          <div
            key={video.id}
            className="group relative bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
          >
            {/* Video container with error handling */}
            <div className="relative w-full h-48 bg-gray-50 border-b border-gray-200">
              <video
                src={video.video_url}
                className="absolute inset-0 w-full h-full object-cover"
                controls
                preload="metadata"
                crossOrigin="anonymous"
                onError={(e) => {
                  const target = e.target as HTMLVideoElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = document.createElement("div");
                    fallback.className =
                      "absolute inset-0 flex flex-col items-center justify-center bg-gray-100";
                    fallback.innerHTML = `
                      <div class="flex flex-col items-center justify-center p-4">
                        <svg class="w-12 h-12 text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span class="text-xs text-red-500 text-center">The video could not find on server</span>
                        
                      </div>
                    `;
                    parent.appendChild(fallback);
                  }
                }}
                onLoadedMetadata={(e) => {
                  const target = e.target as HTMLVideoElement;
                  target.style.display = "block";
                  // Remove any existing fallback
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = parent.querySelector(
                      "div[class*='flex flex-col items-center']"
                    );
                    if (fallback) {
                      fallback.remove();
                    }
                  }
                }}
              />
            </div>

            {/* Hover overlay with action buttons */}
            {isAdmin && (
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit({ item: video })}
                  className="p-1.5 bg-white rounded-full shadow-sm hover:bg-blue-100 transition-colors"
                  title="Edit"
                >
                  <PencilIcon className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={() => handleDelete(video)}
                  disabled={isDeleting || isDeletingLocal}
                  className="p-1.5 bg-white rounded-full shadow-sm hover:bg-blue-200 transition-colors"
                  title="Delete"
                >
                  <TrashIcon className="w-5 h-5 text-red-500" />
                </button>
              </div>
            )}

            {/* Video metadata section */}
            <div className="p-2 space-y-2">
              {video.article_id && (
                <div className="text-xs mb-1 truncate">
                  <span className="font-medium mr-1">Article ID:</span>{" "}
                  <span className="text-gray-500">{video.article_id}</span>
                </div>
              )}
              {video.article_title && (
                <div className="text-xs mb-1 truncate">
                  <span className="font-medium mr-1">Article Title:</span>{" "}
                  <span className="text-gray-500">{video.article_title}</span>
                </div>
              )}
              <div className="text-xs mb-1 truncate">
                <span className="font-medium mr-1">Description:</span>{" "}
                <span className="text-gray-500">
                  {video.description || "No description available"}
                </span>
              </div>
              <p className="text-xs flex items-center gap-1 truncate">
                <span className="mr-1 font-medium">Last updated:</span>{" "}
                <span className="text-gray-500">
                  {formatDateToLocal(video.updated_at)}
                </span>
                <span>
                  <ClockIcon className="w-3 h-3 text-gray-500" />
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Load More button */}
      {hasMore && onLoadMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-400 px-5 py-2 text-sm font-medium text-white transition-colors hover:from-blue-700 hover:to-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
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
