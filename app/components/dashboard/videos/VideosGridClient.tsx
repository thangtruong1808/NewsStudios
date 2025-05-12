"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ClockIcon, PencilIcon } from "@heroicons/react/24/outline";
import DeleteVideoButton from "./DeleteVideoButton";
import Pagination from "../users/Pagination";

interface Video {
  id: number;
  article_id: number | null;
  video_url: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface VideosGridClientProps {
  videos: Video[];
  articleMap: Map<number, string>;
  searchQuery?: string;
}

export default function VideosGridClient({
  videos,
  articleMap,
  searchQuery = "",
}: VideosGridClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [localVideos, setLocalVideos] = useState(videos);
  const itemsPerPage = 6; // Show 8 videos per page
  const totalPages = Math.ceil(localVideos.length / itemsPerPage);

  // Update localVideos when videos prop changes (including search updates)
  useEffect(() => {
    setLocalVideos(videos);
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [videos]);

  // Calculate the current page's videos
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVideos = localVideos.slice(startIndex, endIndex);

  // Handle video deletion
  const handleVideoDelete = (deletedVideoId: number) => {
    setLocalVideos((prevVideos) =>
      prevVideos.filter((video) => video.id !== deletedVideoId)
    );

    // If the current page becomes empty after deletion, go to the previous page
    if (currentVideos.length === 1 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {currentVideos.map((video) => {
          if (!video.video_url) {
            console.warn(`Video with ID ${video.id} has no URL, skipping`);
            return null;
          }

          // Format the updated_at date
          const updatedDate = video.updated_at
            ? new Date(video.updated_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "N/A";

          // Get article title if article_id exists
          const articleTitle =
            video.article_id && articleMap.has(video.article_id)
              ? articleMap.get(video.article_id)
              : null;

          return (
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
                    <ClockIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-500">{updatedDate}</span>
                  </div>
                </div>

                {video.article_id && (
                  <div className="text-sm">
                    <span className="text-xs font-medium text-indigo-600">
                      Article Title:{" "}
                    </span>
                    <span className="text-xs text-gray-500 line-clamp-1">
                      {articleTitle ? articleTitle : `ID: ${video.article_id}`}
                    </span>
                  </div>
                )}

                {video.description && (
                  <div className="text-sm">
                    <span className="text-xs font-medium text-indigo-600">
                      Description:{" "}
                    </span>
                    <span className="text-xs text-gray-500 line-clamp-2">
                      {video.description}
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
                  <Link
                    href={`/dashboard/videos/${video.id}/edit`}
                    className="inline-flex items-center gap-1 rounded border border-blue-500 px-2.5 py-1.5 text-xs font-medium text-blue-500 hover:bg-blue-100 min-w-[70px] justify-center"
                  >
                    <PencilIcon className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </Link>
                  <DeleteVideoButton
                    videoId={video.id}
                    onDelete={() => handleVideoDelete(video.id)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {videos.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={videos.length}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
