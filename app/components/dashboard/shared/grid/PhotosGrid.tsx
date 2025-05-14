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

interface PhotosGridProps {
  photos: Image[];
  onEdit: (photo: Image) => void;
  onDelete: (photo: Image) => void;
  isLoading?: boolean;
}

export default function PhotosGrid({
  photos,
  onEdit,
  onDelete,
  isLoading = false,
}: PhotosGridProps) {
  const [isDeleting, setIsDeleting] = useState(false);

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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {[...Array(12)].map((_, index) => (
          <div
            key={index}
            className="group relative bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div className="relative aspect-square">
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="group relative bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <div className="relative aspect-square">
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
                      fallback.className = "w-full h-full relative";
                      fallback.innerHTML = `
                        <img 
                          src="/image-not-found.svg" 
                          alt="No Image Available" 
                          style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain;"
                        />
                      `;
                      parent.appendChild(fallback);
                    }
                  }}
                />
              </div>
            ) : (
              <div className="w-full h-full relative">
                <img
                  src="/image-not-found.svg"
                  alt="No Image Available"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
            )}
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
          <div className="p-3">
            {photo.article_id && (
              <div className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Article ID:</span>{" "}
                {photo.article_id}
              </div>
            )}
            {photo.article_title && (
              <div className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Article:</span>{" "}
                {photo.article_title}
              </div>
            )}
            {photo.description && (
              <p className="text-sm text-gray-700 mb-1 line-clamp-2">
                <span className="font-medium">Description:</span>{" "}
                {photo.description}
              </p>
            )}
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
