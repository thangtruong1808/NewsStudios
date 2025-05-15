"use client";

import { Video } from "@/app/lib/definition";
import { PencilIcon, TrashIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { toast } from "react-hot-toast";

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
    if (!confirm("Are you sure you want to delete this video?")) return;

    setIsDeleting(true);
    try {
      await onDelete(video);
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Failed to delete video");
    } finally {
      setIsDeleting(false);
    }
  };

  // Loading skeleton UI
  if (isLoading) {
    return (
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
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {videos.map((video) => (
        <div
          key={video.id}
          className="group relative bg-white rounded-lg shadow-sm overflow-hidden"
        >
          {/* Video container with error handling */}
          <div className="relative aspect-[4/3]">
            <div className="w-full h-full relative">
              <video
                src={video.video_url}
                className="w-full h-full object-cover"
                controls
                onError={(e) => {
                  const target = e.target as HTMLVideoElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = document.createElement("div");
                    fallback.className =
                      "w-full h-full flex flex-col items-center justify-center bg-gray-50";
                    fallback.innerHTML = `
                      <div class="flex flex-col items-center justify-center text-gray-400">
                        <svg class="w-10 h-10 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span class="text-xs text-center font-medium">Video not available on server</span>
                      </div>
                    `;
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>

            {/* Hover overlay with action buttons */}
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => onEdit(video)}
                className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
                title="Edit"
              >
                <PencilIcon className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => handleDelete(video)}
                disabled={isDeleting}
                className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
                title="Delete"
              >
                <TrashIcon className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>

          {/* Video metadata section */}
          <div className="p-3">
            {video.article_id && (
              <div className="text-xs font-medium text-gray-700 mb-1">
                <span className="font-medium">Article ID:</span>{" "}
                {video.article_id}
              </div>
            )}
            {video.article_title && (
              <div className="text-xs font-medium text-gray-700 mb-1">
                <span className="font-medium">Article Title:</span>{" "}
                {video.article_title}
              </div>
            )}
            {/* {video.description && (
              <p className="text-xs text-gray-500 mb-1 line-clamp-2">
                <span className="font-medium">Description:</span>{" "}
                {video.description}
              </p>
            )} */}
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <ClockIcon className="w-3 h-3" />
              Updated: {new Date(video.updated_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
