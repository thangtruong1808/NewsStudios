"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ArticleFormData } from "../articleSchema";
import { LoadingSpinner } from "@/app/components/dashboard/shared/loading-spinner";

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
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Image</label>
        <div className="mt-1 flex items-center space-x-4">
          <input
            type="text"
            {...register("image")}
            placeholder="Image URL"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onFileUpload(file, "image");
              }
            }}
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
        {imageUrl && (
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-700">Preview:</p>
            <div className="mt-1 relative h-48 w-48 overflow-hidden rounded-md">
              <img
                src={imageUrl}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Video</label>
        <div className="mt-1 flex items-center space-x-4">
          <input
            type="text"
            {...register("video")}
            placeholder="Video URL"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border px-3 py-2"
          />
          <input
            type="file"
            accept="video/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onFileUpload(file, "video");
              }
            }}
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
        {videoUrl && (
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-700">Preview:</p>
            <video
              src={videoUrl}
              controls
              className="mt-1 max-w-md rounded-md"
            />
          </div>
        )}
      </div>
    </div>
  );
}
