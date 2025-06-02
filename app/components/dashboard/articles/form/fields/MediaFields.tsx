"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ArticleFormData } from "../articleSchema";
import { LoadingSpinner } from "@/app/components/dashboard/shared/loading-spinner";
import { PhotoIcon } from "@heroicons/react/24/outline";
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
}

export default function MediaFields({
  register,
  errors,
  imageUrl,
  videoUrl,
  uploadProgress,
  onFileUpload,
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
        <label className="block text-sm font-medium">Image</label>
        <div className="mt-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
        {imageUrl && (
          <div className="mt-2">
            <p className="text-sm font-medium">Preview:</p>
            <div className="mt-1 relative h-24 w-24 overflow-hidden rounded-md">
              <img
                src={imageUrl}
                alt="Preview"
                className="h-full w-full object-cover"
                onError={(e) => {
                  console.error("Error loading image:", imageUrl);
                  (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Video</label>
        <div className="mt-1">
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:px-4 file:py-2 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
        {videoUrl && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
            <div className="max-w-md rounded-md border border-gray-200 overflow-hidden">
              <video src={videoUrl} controls className="w-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
