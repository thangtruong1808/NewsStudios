"use client";

import React from "react";
import Image from "next/image";

interface ServerImageProps {
  imageData: string; // Base64 data URL or direct URL
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  useDirectUrl?: boolean;
}

export default function ServerImage({
  imageData,
  alt,
  width = 300,
  height = 300,
  className = "",
  useDirectUrl = false,
}: ServerImageProps) {
  if (!imageData) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 rounded-lg ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-500">Failed to load image</span>
      </div>
    );
  }

  // If using direct URL, use a regular img tag instead of Next.js Image
  if (useDirectUrl) {
    return (
      <div className={`relative overflow-hidden rounded-lg ${className}`}>
        <img
          src={imageData}
          alt={alt}
          width={width}
          height={height}
          className="object-cover w-full h-full"
          onError={(e) => {
            console.error(`Error loading image: ${imageData}`);
            // Add a fallback image or error handling here
            (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
          }}
        />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <Image
        src={imageData}
        alt={alt}
        width={width}
        height={height}
        className="object-cover w-full h-full"
      />
    </div>
  );
}
