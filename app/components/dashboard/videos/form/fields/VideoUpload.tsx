"use client";

import { useState } from "react";
import { uploadVideoToServer } from "@/app/lib/actions/videos";
import {
  showSuccessToast,
  showErrorToast,
} from "@/app/components/dashboard/shared/toast/Toast";

interface VideoUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export default function VideoUpload({ value, onChange }: VideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await uploadVideoToServer(file);
      if (result.error) {
        throw new Error(result.error);
      }
      onChange(result.url);
      showSuccessToast({ message: "Video uploaded successfully" });
    } catch (error) {
      console.error("Error uploading video:", error);
      showErrorToast({ message: "Failed to upload video" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <label
        htmlFor="video"
        className="block text-sm font-medium text-gray-700"
      >
        Video *
      </label>
      <div className="mt-2">
        <input
          type="file"
          id="video"
          accept="video/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>
      {value && (
        <div className="mt-2 max-w-2xl mx-auto">
          <video
            src={value}
            controls
            className="w-full aspect-video object-cover rounded-md"
          />
        </div>
      )}
    </div>
  );
}
