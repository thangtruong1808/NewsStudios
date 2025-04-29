"use client";

import React, { useState, useRef } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { uploadToCloudinary } from "@/app/lib/utils/cloudinaryUtils";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface VideoUploadProps {
  onVideoUrlChange: (url: string) => void;
  error?: string;
}

export default function VideoUpload({
  onVideoUrlChange,
  error,
}: VideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a valid video file");
      return;
    }

    // Validate file size (max 500MB)
    const maxSize = 500 * 1024 * 1024; // 500MB in bytes
    if (file.size > maxSize) {
      toast.error("Video file size must be less than 500MB");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const result = await uploadToCloudinary(file, "video");

      if (!result.success || !result.url) {
        throw new Error(result.error || "Failed to upload video");
      }

      setPreviewUrl(result.url);
      onVideoUrlChange(result.url);
      toast.success("Video uploaded successfully!");
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload video"
      );
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="video"
          className="block text-sm font-medium text-gray-700"
        >
          Upload Video
        </label>
        <input
          ref={fileInputRef}
          type="file"
          id="video"
          accept="video/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isUploading}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      {isUploading && (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-gray-500">
            Uploading video... Please wait.
          </span>
        </div>
      )}

      {previewUrl && !isUploading && (
        <div className="mt-4">
          <video
            src={previewUrl}
            controls
            className="max-w-full h-auto rounded-lg"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}
