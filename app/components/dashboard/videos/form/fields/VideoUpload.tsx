"use client";

import { useState, useCallback, useEffect } from "react";
import {
  showSuccessToast,
  showErrorToast,
} from "@/app/components/dashboard/shared/toast/Toast";
import { LoadingSpinner } from "@/app/components/dashboard/shared/loading-spinner";

interface VideoUploadProps {
  value: string;
  onChange: (file: File | null) => void;
  selectedFile: File | null;
}

export default function VideoUpload({
  value,
  onChange,
  selectedFile,
}: VideoUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingFileName, setProcessingFileName] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Create preview URL when file is selected
  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(value || null);
    }
  }, [selectedFile, value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setProcessingFileName(file.name);

    try {
      // Validate file type
      if (!file.type.startsWith("video/")) {
        throw new Error("Please select a video file");
      }

      // Validate file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        throw new Error("Video size should be less than 50MB");
      }

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      onChange(file);
      showSuccessToast({ message: "Video selected successfully" });
    } catch (error) {
      console.error("Error processing video:", error);
      showErrorToast({
        message:
          error instanceof Error ? error.message : "Failed to process video",
      });
      onChange(null);
    } finally {
      setIsProcessing(false);
      setProcessingFileName("");
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
          disabled={isProcessing}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      {/* Processing State */}
      {isProcessing && (
        <div className="mt-2">
          <div className="flex items-center space-x-2">
            <LoadingSpinner />
            <span className="text-sm text-gray-600">
              Processing {processingFileName}...
            </span>
          </div>
        </div>
      )}

      {/* Video Preview */}
      {previewUrl && !isProcessing && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
          <div className="max-w-2xl mx-auto">
            <video
              src={previewUrl}
              controls
              className="w-full aspect-video object-cover rounded-md"
            />
          </div>
        </div>
      )}

      {/* Fallback State */}
      {!previewUrl && !isProcessing && (
        <div className="mt-2 text-sm text-gray-500">
          No video selected. Please upload a video file.
        </div>
      )}
    </div>
  );
}
