"use client";

import { Image } from "@/app/lib/definition";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { PhotoActions } from "./PhotoActions";
import { PhotoMetadata } from "./PhotoMetadata";

interface PhotoCardProps {
  photo: Image;
  onEdit: (photo: Image) => void;
  onDelete: (photo: Image) => void;
  isDeleting?: boolean;
}

export function PhotoCard({
  photo,
  onEdit,
  onDelete,
  isDeleting,
}: PhotoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    setHasError(true);
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm overflow-hidden group relative ${
        hasError ? "ring-2 ring-gray-300 ring-opacity-50" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Photo container with fixed dimensions */}
      <div className="relative w-full h-48">
        {hasError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 border-b border-gray-200">
            <PhotoIcon className="w-12 h-12 text-red-400 mb-2" />
            <span className="text-xs text-red-500 text-center">
              The Image could not find on server
            </span>
          </div>
        ) : (
          <img
            src={photo.image_url}
            alt={photo.description || "Photo"}
            className="absolute inset-0 w-full h-full object-cover"
            onError={handleImageError}
          />
        )}
        <PhotoActions
          photo={photo}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={isDeleting}
          isVisible={isHovered}
        />
      </div>

      <PhotoMetadata photo={photo} />
    </div>
  );
}
