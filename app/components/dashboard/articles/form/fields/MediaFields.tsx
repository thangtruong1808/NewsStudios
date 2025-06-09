"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ArticleFormData } from "../articleSchema";
import { LoadingSpinner } from "@/app/components/dashboard/shared/loading-spinner";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

interface MediaFieldsProps {
  register: UseFormRegister<ArticleFormData>;
  errors: FieldErrors<ArticleFormData>;
  imageUrl: string | null;
  videoUrl: string | null;
  uploadProgress: {
    image?: number;
    video?: number;
  };
  onFileUpload: (file: File, type: "image" | "video") => Promise<void>;
  onRemoveMedia: (type: "image" | "video") => void;
}

export default function MediaFields({
  register,
  errors,
  imageUrl,
  videoUrl,
  uploadProgress,
  onFileUpload,
  onRemoveMedia,
}: MediaFieldsProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (selectedImage && selectedImage.startsWith("blob:")) {
        URL.revokeObjectURL(selectedImage);
      }
      if (selectedVideo && selectedVideo.startsWith("blob:")) {
        URL.revokeObjectURL(selectedVideo);
      }
    };
  }, [selectedImage, selectedVideo]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onFileUpload(file, "image");
    }
  };

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onFileUpload(file, "video");
    }
  };

  return (
    <div className="space-y-6">
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
        {errors.image && (
          <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
        )}
        {imageUrl && (
          <div className="mt-2 relative">
            <img
              src={imageUrl}
              alt="Preview"
              className="h-32 w-32 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => onRemoveMedia("image")}
              className="absolute -top-2 -right-2 inline-flex items-center gap-1 rounded border border-red-500 px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors duration-200"
            >
              <XMarkIcon className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
        )}
      </div>

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
        {errors.video && (
          <p className="mt-1 text-sm text-red-600">{errors.video.message}</p>
        )}
        {videoUrl && (
          <div className="mt-2 relative">
            <video
              src={videoUrl}
              controls
              className="h-32 w-32 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => onRemoveMedia("video")}
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
