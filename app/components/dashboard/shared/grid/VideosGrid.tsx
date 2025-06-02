"use client";

import { Video } from "@/app/lib/definition";
import { PencilIcon, TrashIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import {
  showConfirmationToast,
  showErrorToast,
} from "@/app/components/dashboard/shared/toast/Toast";

// Props interface for VideosGrid component
interface VideosGridProps {
  videos: Video[]; // Array of video objects to display
  onEdit: (video: Video) => void; // Callback for edit action
  onDelete: (video: Video) => void; // Callback for delete action
  isLoading?: boolean; // Loading state indicator
}

export default function VideosGrid({
  videos,
  onEdit,
  onDelete,
  isLoading = false,
}: VideosGridProps) {
  // State to track deletion process
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle video deletion with confirmation
  const handleDelete = async (video: Video) => {
    setIsDeleting(true);
    try {
      await onDelete(video);
    } catch (error) {
      console.error("Error deleting video:", error);
      // Let the parent component handle the error toast
      throw error; // Re-throw the error to be handled by the parent
    } finally {
      setIsDeleting(false);
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
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3" />
              </div>
            </div>
          ))}
        </div>
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
                onError={(e) => {
                  const target = e.target as HTMLVideoElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = document.createElement("div");
                    fallback.className =
                      "absolute inset-0 flex flex-col items-center justify-center";
                    fallback.innerHTML = `
                      <div class="flex flex-col items-center justify-center">
                        <svg class="w-12 h-12 text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span class="text-xs text-red-500 text-center">The video could not find on server</span>
                      </div>
                    `;
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>

            {/* Hover overlay with action buttons */}
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(video)}
                className="p-1.5 bg-white rounded-full shadow-sm hover:bg-blue-100 transition-colors"
                title="Edit"
              >
                <PencilIcon className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={() => handleDelete(video)}
                disabled={isDeleting}
                className="p-1.5 bg-white rounded-full shadow-sm hover:bg-blue-200 transition-colors"
                title="Delete"
              >
                <TrashIcon className="w-5 h-5 text-red-500" />
              </button>
            </div>

            {/* Video metadata section */}
            <div className="p-3">
              {video.article_id && (
                <div className="text-xs mb-1">
                  <span className="font-medium mr-1">Article ID:</span>{" "}
                  <span className="text-gray-500">{video.article_id}</span>
                </div>
              )}
              {video.article_title && (
                <div className="text-xs mb-1">
                  <span className="font-medium mr-1">Article Title:</span>{" "}
                  <span className="text-gray-500">{video.article_title}</span>
                </div>
              )}
              <div className="text-xs mb-1 line-clamp-2 min-h-[2.5rem]">
                <span className="font-medium mr-1">Description:</span>{" "}
                <span className="text-gray-500">
                  {video.description || "No description available"}
                </span>
              </div>
              <p className="text-xs flex items-center gap-1">
                <span className="mr-1 font-medium">Last updated:</span>{" "}
                <span className="text-gray-500">
                  {new Date(video.updated_at).toLocaleDateString()}
                </span>
                <span>
                  <ClockIcon className="w-3 h-3 text-gray-500" />
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
