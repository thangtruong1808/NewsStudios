"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ArticleFormData } from "../articleSchema";
import { LoadingSpinner } from "@/app/components/dashboard/shared/loading-spinner";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setSelectedImage(previewUrl);
      await onFileUpload(file, "image");
    }
  };

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL for the selected video
      const previewUrl = URL.createObjectURL(file);
      setSelectedVideo(previewUrl);
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
        {uploadProgress.image !== undefined && (
          <div className="mt-2">
            <div className="h-2 w-full bg-gray-200 rounded-full">
              <div
                className="h-2 bg-indigo-600 rounded-full transition-all duration-300"
                style={{
                  width: `${uploadProgress.image}%`,
                }}
              />
            </div>
            {uploadProgress.image < 100 && <LoadingSpinner />}
          </div>
        )}
        {selectedImage && (
          <div className="mt-2">
            <p className="text-sm font-medium ">Preview:</p>
            <div className="mt-1 relative h-24 w-24 overflow-hidden rounded-md">
              <img
                src={selectedImage}
                alt="Preview"
                className="h-full w-full object-cover"
                onError={(e) => {
                  console.error("Error loading image:", selectedImage);
                  (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium ">Video</label>
        <div className="mt-1">
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
        {uploadProgress.video !== undefined && (
          <div className="mt-2">
            <div className="h-2 w-full bg-gray-200 rounded-full">
              <div
                className="h-2 bg-indigo-600 rounded-full transition-all duration-300"
                style={{
                  width: `${uploadProgress.video}%`,
                }}
              />
            </div>
            {uploadProgress.video < 100 && <LoadingSpinner />}
          </div>
        )}
        {selectedVideo && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
            <div className="max-w-md rounded-md border border-gray-200 overflow-hidden">
              <video src={selectedVideo} controls className="w-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
