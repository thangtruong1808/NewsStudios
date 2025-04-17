"use client";

import { useState } from "react";
import { uploadImage } from "../lib/utils/cloudinaryUtils";
import { toast } from "react-hot-toast";

export default function TestCloudinaryPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [configInfo, setConfigInfo] = useState<string>("");

  // Function to display environment variables (client-side only)
  const displayConfig = () => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    setConfigInfo(`
      Cloudinary Configuration:
      - Cloud Name: ${cloudName || "Not set"}
      - Upload Preset: ${uploadPreset || "Not set"}
    `);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Create a preview URL for the selected image
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);

      // Clean up the object URL when component unmounts or file changes
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Uploading image to Cloudinary...");

    try {
      console.log("Uploading file:", {
        name: file.name,
        type: file.type,
        size: file.size,
      });

      // Use the upload preset without specifying a folder
      const result = await uploadImage(file);

      if (result.error) {
        toast.error(`Upload failed: ${result.error}`, { id: toastId });
        return;
      }

      toast.success(`Image uploaded successfully! URL: ${result.url}`, {
        id: toastId,
      });
      setFile(null);
      setPreviewUrl(null);
      // Reset file input
      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(
        `Failed to upload image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        { id: toastId }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-4">Test Cloudinary Upload</h1>

      <div className="mb-4">
        <button
          onClick={displayConfig}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Show Cloudinary Config
        </button>

        {configInfo && (
          <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto">
            {configInfo}
          </pre>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      {previewUrl && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-1">Preview:</p>
          <img
            src={previewUrl}
            alt="Preview"
            className="max-h-40 rounded-md border border-gray-300"
          />
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className="w-full px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Uploading..." : "Upload to Cloudinary"}
      </button>
    </div>
  );
}
