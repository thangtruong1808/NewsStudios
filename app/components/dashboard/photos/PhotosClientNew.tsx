"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
import { getImages } from "../../../lib/actions/images";
import ServerImage from "../../../components/ServerImage";

interface ImageData {
  id: number;
  article_id: number | null;
  image_url: string;
  description: string | undefined;
  created_at: string;
  updated_at: string;
  title?: string;
  useDirectUrl?: boolean;
}

interface PhotosClientNewProps {
  images: ImageData[];
}

export default function PhotosClientNew({ images }: PhotosClientNewProps) {
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-semibold text-gray-900">Photos</h1>
        <Link
          href="/dashboard/photos/create"
          className="flex h-10 items-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          <span className="hidden md:block">Add Photo</span>{" "}
          <PlusIcon className="h-5 md:ml-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative aspect-square cursor-pointer overflow-hidden rounded-lg"
            onClick={() => setSelectedImage(image)}
          >
            <ServerImage
              imageData={image.image_url}
              alt={image.title || "Gallery image"}
              width={400}
              height={400}
              className="object-cover transition-transform duration-300 hover:scale-110"
              useDirectUrl={true}
            />
          </div>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <ServerImage
              imageData={selectedImage.image_url}
              alt={selectedImage.title || "Gallery image"}
              width={800}
              height={800}
              className="object-contain"
              useDirectUrl={true}
            />
            <button
              className="absolute top-4 right-4 rounded-full bg-white p-2 text-black hover:bg-gray-200"
              onClick={() => setSelectedImage(null)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
