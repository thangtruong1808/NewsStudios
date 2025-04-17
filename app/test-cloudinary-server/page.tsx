"use client";

import { useState } from "react";
import CloudinaryUploader from "../components/CloudinaryUploader";
import { toast } from "react-hot-toast";

export default function TestCloudinaryServerPage() {
  const [uploadedImage, setUploadedImage] = useState<{
    url: string;
    publicId: string;
  } | null>(null);

  const handleUploadComplete = (url: string, publicId: string) => {
    setUploadedImage({ url, publicId });
    toast.success("Image uploaded successfully!");
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-4">Test Cloudinary Server Upload</h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Upload Image</h2>
        <CloudinaryUploader
          onUploadComplete={handleUploadComplete}
          folder="newshub_photos"
          uploadPreset="NewsHub"
          buttonText="Upload to Cloudinary"
        />
      </div>

      {uploadedImage && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Uploaded Image</h2>
          <div className="border rounded-md p-4">
            <img
              src={uploadedImage.url}
              alt="Uploaded"
              className="max-w-full h-auto rounded-md mb-2"
            />
            <div className="text-sm text-gray-600 break-all">
              <p>
                <strong>URL:</strong> {uploadedImage.url}
              </p>
              <p>
                <strong>Public ID:</strong> {uploadedImage.publicId}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
