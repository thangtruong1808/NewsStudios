"use client";

import { useState } from "react";
import { uploadVideoToServer } from "@/app/lib/actions/videos";
import { toast } from "react-hot-toast";

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
      toast.success("Video uploaded successfully");
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload video"
      );
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
        Video
      </label>
      <div className="mt-1 flex items-center space-x-4">
        <input
          type="file"
          id="video"
          accept="video/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
        {value && (
          <video
            src={value}
            className="h-20 w-32 object-cover rounded"
            controls
          />
        )}
      </div>
      {isUploading && (
        <p className="mt-2 text-sm text-gray-500">Uploading video...</p>
      )}
    </div>
  );
}
