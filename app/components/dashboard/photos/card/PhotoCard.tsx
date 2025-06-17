"use client";

import { Image as ImageType } from "@/app/lib/definition";
import { useState } from "react";
import { PhotoActions } from "./PhotoActions";
import { PhotoMetadata } from "./PhotoMetadata";
import NextImage from "next/image";

interface PhotoCardProps {
  photo: ImageType;
  onEdit: (_photo: ImageType) => void;
  onDelete: (_photo: ImageType) => void;
  isDeleting: boolean;
}

export default function PhotoCard({
  photo,
  onEdit,
  onDelete,
  isDeleting,
}: PhotoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow transition-all hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square">
        <NextImage
          src={photo.image_url}
          alt={photo.description || "Photo"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity">
            <PhotoActions
              photo={photo}
              onEdit={onEdit}
              onDelete={onDelete}
              isDeleting={isDeleting}
              isVisible={isHovered}
            />
          </div>
        )}
      </div>
      <PhotoMetadata photo={photo} />
    </div>
  );
}
