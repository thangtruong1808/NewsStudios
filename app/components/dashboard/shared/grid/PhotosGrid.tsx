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
import {
  showErrorToast,
  showConfirmationToast,
} from "@/app/components/dashboard/shared/toast/Toast";

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
  const [hoveredPhoto, setHoveredPhoto] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  // Handle photo deletion with confirmation
  const handleDelete = async (photo: Image) => {
    const confirmPromise = new Promise<boolean>((resolve) => {
      showConfirmationToast({
        title: "Delete Photo",
        message:
          "Are you sure you want to delete this photo? This action cannot be undone.",
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });

    const isConfirmed = await confirmPromise;
    if (!isConfirmed) return;

    try {
      await onDelete(photo);
    } catch (error) {
      console.error("Error deleting photo:", error);
      showErrorToast({ message: "Failed to delete photo" });
    }
  };

  // Handle image loading error
  const handleImageError = (photoId: number) => {
    if (!failedImages.has(photoId)) {
      setFailedImages((prev) => new Set([...prev, photoId]));
    }
  };

  // Loading skeleton UI
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {[...Array(12)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse"
          >
            <div className="w-full h-48 bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="flex justify-end space-x-2">
                <div className="h-8 w-8 bg-gray-200 rounded" />
                <div className="h-8 w-8 bg-gray-200 rounded" />
              </div>
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
          className={`bg-white rounded-lg shadow-sm overflow-hidden group relative ${
            failedImages.has(photo.id)
              ? "ring-2 ring-gray-300 ring-opacity-50"
              : ""
          }`}
          onMouseEnter={() => setHoveredPhoto(photo.id)}
          onMouseLeave={() => setHoveredPhoto(null)}
        >
          {/* Photo container with fixed dimensions */}
          <div className="relative w-full h-48">
            {failedImages.has(photo.id) ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
                <PhotoIcon className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-xs text-gray-500 text-center">
                  Image not available
                </span>
              </div>
            ) : (
              <img
                src={photo.image_url}
                alt={photo.description || "Photo"}
                className="absolute inset-0 w-full h-full object-cover"
                onError={() => handleImageError(photo.id)}
              />
            )}
            {/* Action buttons in top right corner */}
            <div
              className={`absolute top-2 right-2 flex gap-2 transition-opacity duration-200 ${
                hoveredPhoto === photo.id ? "opacity-100" : "opacity-0"
              }`}
            >
              <button
                onClick={() => onEdit(photo)}
                className="p-2 rounded-full bg-white text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
                title="Edit photo"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDelete(photo)}
                className="p-2 rounded-full bg-white text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
                title="Delete photo"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Photo metadata */}
          <div className="p-4">
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium">Article ID:</span>
              <span className="text-xs text-gray-500">
                {photo.article_id || "No article associated"}
              </span>
            </div>
            {photo.article_title && (
              <div className="mt-1">
                <span className="text-xs font-medium">Article Title:</span>
                <div className="text-xs text-gray-500 line-clamp-4 min-h-[2.5rem]">
                  {photo.article_title}
                </div>
              </div>
            )}
            <div className="mt-2 flex items-center gap-1">
              <ClockIcon className="h-4 w-4 text-gray-400" />
              <span className="text-xs font-medium">Last updated:</span>
              <span className="text-xs text-gray-500">
                {new Date(photo.updated_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
