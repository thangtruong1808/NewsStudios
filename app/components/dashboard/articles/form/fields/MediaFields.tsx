"use client";

import type { UseFormRegister } from "react-hook-form";
import type { ArticleFormData } from "../articleSchema";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import type { UseArticleFormResult } from "../hooks/useArticleForm";

interface MediaFieldsProps {
  register: UseFormRegister<ArticleFormData>;
  imageUrl: string | null;
  videoUrl: string | null;
  onFileUpload: UseArticleFormResult["handleFileUpload"];
  onRemoveMedia: UseArticleFormResult["handleRemoveMedia"];
}

// Component Info
// Description: Manage media selection, preview, and removal controls for article assets.
// Date created: 2025-01-27
// Author: thangtruong
export default function MediaFields({
  register,
  imageUrl,
  videoUrl,
  onFileUpload,
  onRemoveMedia,
}: MediaFieldsProps) {
  register("image");
  register("video");

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onFileUpload({ file, type: "image" });
    }
  };

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onFileUpload({ file, type: "video" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Image upload */}
      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700"
        >
          Image
        </label>
        <div className="mt-1">
          <input
            type="file"
            id="image"
            accept="image/*"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            onChange={handleImageChange}
          />
        </div>
        {imageUrl && (
          <div className="mt-2 relative">
            <Image
              src={imageUrl}
              alt="Preview"
              width={128}
              height={128}
              className="h-32 w-32 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => onRemoveMedia({ type: "image" })}
              className="absolute -top-2 -right-2 inline-flex items-center gap-1 rounded border border-red-500 px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors duration-200"
            >
              <XMarkIcon className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Video upload */}
      <div>
        <label
          htmlFor="video"
          className="block text-sm font-medium text-gray-700"
        >
          Video
        </label>
        <div className="mt-1">
          <input
            type="file"
            id="video"
            accept="video/*"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            onChange={handleVideoChange}
          />
        </div>
        {videoUrl && (
          <div className="mt-2 relative">
            <video
              src={videoUrl}
              controls
              className="h-32 w-32 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => onRemoveMedia({ type: "video" })}
              className="absolute -top-2 -right-2 inline-flex items-center gap-1 rounded border border-red-500 px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors duration-200"
            >
              <XMarkIcon className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
