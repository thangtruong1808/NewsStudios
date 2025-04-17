"use client";

import { useState, useRef } from "react";
import { uploadImage } from "../lib/utils/cloudinaryUtils";
import { toast } from "react-hot-toast";

interface CloudinaryUploaderProps {
  onUploadComplete?: (url: string, publicId: string) => void;
  folder?: string;
  uploadPreset?: string;
  buttonText?: string;
}

export default function CloudinaryUploader({
  onUploadComplete,
  folder = "newshub_photos",
  uploadPreset = "NewsHub",
  buttonText = "Upload Image",
}: CloudinaryUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    try {
      setIsUploading(true);

      // Pass only the file and folder to the uploadImage function
      const result = await uploadImage(selectedFile, folder);

      if (!result.success) {
        throw new Error(result.error);
      }

      if (result.url && result.publicId) {
        toast.success("Image uploaded successfully!");
        onUploadComplete?.(result.url, result.publicId);

        // Reset form
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Select Image
        </label>
        {selectedFile && (
          <p className="mt-2 text-sm text-gray-600">
            Selected: {selectedFile.name}
          </p>
        )}
      </div>

      {previewUrl && (
        <div className="mt-4">
          <img
            src={previewUrl}
            alt="Preview"
            className="max-w-full h-auto rounded-md"
          />
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!selectedFile || isUploading}
        className={`w-full py-2 px-4 rounded-md text-white ${
          !selectedFile || isUploading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600"
        } transition-colors`}
      >
        {isUploading ? "Uploading..." : buttonText}
      </button>
    </div>
  );
}
