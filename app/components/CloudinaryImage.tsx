"use client";

import React, { useState, useEffect } from "react";
import {
  getImageUrl,
  isCloudinaryUrl,
  getPublicIdFromUrl,
} from "../lib/utils/cloudinaryUtils";

// Placeholder image (base64 SVG)
const placeholderImage =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+";

interface CloudinaryImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  options?: {
    crop?: string;
    quality?: number;
    format?: string;
  };
}

const CloudinaryImage: React.FC<CloudinaryImageProps> = ({
  src,
  alt,
  width = 300,
  height = 200,
  className = "",
  options = {},
}) => {
  const [imgSrc, setImgSrc] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [debugInfo, setDebugInfo] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    setError(false);
    setDebugInfo("");

    try {
      console.log("CloudinaryImage: Processing source:", src);

      if (!src) {
        throw new Error("No image source provided");
      }

      // Check if the URL is already a Cloudinary URL
      if (isCloudinaryUrl(src)) {
        console.log("CloudinaryImage: Using existing Cloudinary URL");
        setImgSrc(src);
        setDebugInfo(`Using existing Cloudinary URL: ${src}`);
        return;
      }

      // Try to extract public ID from the URL
      const publicId = getPublicIdFromUrl(src);
      if (publicId) {
        console.log("CloudinaryImage: Extracted public ID:", publicId);
        const cloudinaryUrl = getImageUrl(publicId, {
          width,
          height,
          ...options,
        });
        setImgSrc(cloudinaryUrl);
        setDebugInfo(`Using Cloudinary URL for public ID: ${publicId}`);
        return;
      }

      // If not a Cloudinary URL and no public ID found, use the original URL
      console.log("CloudinaryImage: Using original URL");
      setImgSrc(src);
      setDebugInfo(`Using original URL: ${src}`);
    } catch (err) {
      console.error("CloudinaryImage: Error processing image source:", err);
      setError(true);
      setImgSrc(placeholderImage);
      setDebugInfo(
        `Error: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  }, [src, width, height, options]);

  const handleError = () => {
    console.error("CloudinaryImage: Error loading image:", imgSrc);
    setError(true);
    setImgSrc(placeholderImage);
    setDebugInfo(`Failed to load image: ${imgSrc}`);
  };

  const handleLoad = () => {
    console.log("CloudinaryImage: Image loaded successfully:", imgSrc);
    setLoading(false);
    setError(false);
  };

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      <img
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${error ? "opacity-50" : ""}`}
        onError={handleError}
        onLoad={handleLoad}
      />
      {debugInfo && (
        <div className="mt-2 text-xs text-gray-500">
          <p>{debugInfo}</p>
          {error && <p className="text-red-500">Error loading image</p>}
        </div>
      )}
    </div>
  );
};

export default CloudinaryImage;
