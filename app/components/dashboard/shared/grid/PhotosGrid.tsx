"use client";

import { Image } from "@/app/lib/definition";
import NextImage from "next/image";
import {
  PencilIcon,
  TrashIcon,
  ClockIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { toast } from "react-hot-toast";

// Props interface for PhotosGrid component
interface PhotosGridProps {
  photos: Image[]; // Array of image objects to display
  onEdit: (photo: Image) => void; // Callback for edit action
  onDelete: (photo: Image) => void; // Callback for delete action
  isLoading?: boolean; // Loading state indicator
}

export default function PhotosGrid({
  photos,
  onEdit,
  onDelete,
  isLoading = false,
}: PhotosGridProps) {
  // State to track deletion process
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle photo deletion with confirmation
  const handleDelete = async (photo: Image) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;

    setIsDeleting(true);
    try {
      await onDelete(photo);
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast.error("Failed to delete photo");
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
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="group relative bg-white rounded-lg shadow-sm overflow-hidden"
        >
          {/* Photo container with error handling */}
          <div className="relative aspect-[4/3]">
            {photo.image_url ? (
              <div className="w-full h-full relative">
                <NextImage
                  src={photo.image_url}
                  alt={photo.description || "Photo"}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      const fallback = document.createElement("div");
                      fallback.className =
                        "w-full h-full flex flex-col items-center justify-center bg-gray-50";
                      fallback.innerHTML = `
                        <div class="flex flex-col items-center justify-center text-gray-400">
                          <svg class="w-10 h-10 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                          </svg>
                          <span class="text-xs text-center font-medium">Photo not available on server</span>
                        </div>
                      `;
                      parent.appendChild(fallback);
                    }
                  }}
                />
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <PhotoIcon className="w-16 h-16 mb-1" />
                  <span className="text-xs text-center font-medium">
                    No image uploaded
                  </span>
                </div>
              </div>
            )}

            {/* Hover overlay with action buttons */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200">
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => onEdit(photo)}
                  className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
                  title="Edit"
                >
                  <PencilIcon className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDelete(photo)}
                  disabled={isDeleting}
                  className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
                  title="Delete"
                >
                  <TrashIcon className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Photo metadata section */}
          <div className="p-3 space-y-1">
            {photo.article_id && (
              <div className="text-xs">
                <span className="font-medium">Article ID:</span>{" "}
                <span className="text-gray-500">{photo.article_id}</span>
              </div>
            )}
            {photo.article_title && (
              <div className="text-xs">
                <span className="font-medium">Article Title:</span>{" "}
                <span className="text-gray-500">{photo.article_title}</span>
              </div>
            )}
            {/* {photo.description && (
              <p className="text-xs line-clamp-2">
                <span className="font-medium">Description:</span>{" "}
                <span className="text-gray-500">{photo.description}</span>
              </p>
            )} */}
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <ClockIcon className="w-3 h-3" />
              Updated: {new Date(photo.updated_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
