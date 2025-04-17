"use client";

import React, { useState } from "react";
import { constructImageUrl } from "../lib/utils/imageUtils";
import SimpleImage from "./SimpleImage";

interface Photo {
  id: number;
  image_url: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface PhotosClientNewProps {
  photos: Photo[];
}

export default function PhotosClientNew({ photos }: PhotosClientNewProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="relative group cursor-pointer"
          onClick={() => setSelectedPhoto(photo)}
        >
          <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
            <SimpleImage
              src={constructImageUrl(photo.image_url)}
              alt={photo.description || "Photo"}
              width={400}
              height={300}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 rounded-lg">
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {photo.description && (
                <p className="text-sm">{photo.description}</p>
              )}
            </div>
          </div>
        </div>
      ))}

      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300"
              onClick={() => setSelectedPhoto(null)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <SimpleImage
              src={constructImageUrl(selectedPhoto.image_url)}
              alt={selectedPhoto.description || "Selected photo"}
              width={800}
              height={600}
              className="max-h-[90vh] w-auto mx-auto"
            />
            {selectedPhoto.description && (
              <div className="mt-4 text-white text-center">
                <p>{selectedPhoto.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
