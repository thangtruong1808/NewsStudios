"use client";

import React, { useState } from "react";
import SimpleImage from "../components/SimpleImage";
import CloudinaryImage from "../components/CloudinaryImage";
import { constructImageUrl } from "../lib/utils/imageUtils";

export default function TestImagePage() {
  const [localImagePath, setLocalImagePath] = useState("/images/test.jpg");
  const [externalImagePath, setExternalImagePath] =
    useState("/images/test.jpg");
  const [directUrl, setDirectUrl] = useState("https://example.com/image.jpg");
  const [customPath, setCustomPath] = useState("");
  const [base64Image, setBase64Image] = useState("");
  const [cloudinaryUrl, setCloudinaryUrl] = useState("");

  // Construct the external image URL
  const externalImageUrl = constructImageUrl(externalImagePath);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Image Loading Test Page</h1>

      {/* Test Local Image */}
      <div className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Test Local Image</h2>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Local Image Path:
          </label>
          <input
            type="text"
            value={localImagePath}
            onChange={(e) => setLocalImagePath(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <SimpleImage src={localImagePath} alt="Local Test Image" />
      </div>

      {/* Test External Image (Constructed) */}
      <div className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">
          Test External Image (Constructed)
        </h2>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">
            External Image Path:
          </label>
          <input
            type="text"
            value={externalImagePath}
            onChange={(e) => setExternalImagePath(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <SimpleImage src={externalImageUrl} alt="External Test Image" />
      </div>

      {/* Test Direct URL */}
      <div className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Test Direct URL</h2>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Direct URL:
          </label>
          <input
            type="text"
            value={directUrl}
            onChange={(e) => setDirectUrl(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <SimpleImage src={directUrl} alt="Direct URL Test Image" />
      </div>

      {/* Test Iframe Approach */}
      <div className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Test Iframe Approach</h2>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Image Path:
          </label>
          <input
            type="text"
            value={customPath}
            onChange={(e) => setCustomPath(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <SimpleImage
          src={constructImageUrl(customPath)}
          alt="Iframe Test Image"
          useIframe={true}
        />
      </div>

      {/* Test Base64 Approach */}
      <div className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Test Base64 Approach</h2>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Image Path:
          </label>
          <input
            type="text"
            value={customPath}
            onChange={(e) => setCustomPath(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <SimpleImage
          src={constructImageUrl(customPath)}
          alt="Base64 Test Image"
          useBase64={true}
        />
      </div>

      {/* Test Base64 Input */}
      <div className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Test Base64 Input</h2>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Base64 Image Data:
          </label>
          <textarea
            value={base64Image}
            onChange={(e) => setBase64Image(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={4}
          />
        </div>
        <SimpleImage src={base64Image} alt="Base64 Input Test Image" />
      </div>

      {/* Test Cloudinary Approach */}
      <div className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Test Cloudinary Approach</h2>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Cloudinary URL or Public ID:
          </label>
          <input
            type="text"
            value={cloudinaryUrl}
            onChange={(e) => setCloudinaryUrl(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter Cloudinary URL or public ID"
          />
        </div>
        <CloudinaryImage
          src={cloudinaryUrl}
          alt="Cloudinary Test Image"
          width={300}
          height={200}
          options={{
            crop: "fill",
            quality: 80,
          }}
        />
      </div>
    </div>
  );
}
