"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface ImageTestProps {
  imageUrl: string;
}

export default function ImageTest({ imageUrl }: ImageTestProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [directUrl, setDirectUrl] = useState<string | null>(null);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  useEffect(() => {
    // Generate URLs for testing
    const filename = imageUrl.includes("/")
      ? imageUrl.split("/").pop()
      : imageUrl;
    const timestamp = Date.now();

    // Direct URL
    setDirectUrl(
      `https://srv876-files.hstgr.io/83e36b91bb471f62/files/public_html/Images/${filename}`
    );

    // Iframe URL (to test if it's a CORS issue)
    setIframeUrl(
      `https://srv876-files.hstgr.io/83e36b91bb471f62/files/public_html/Images/${filename}`
    );
  }, [imageUrl]);

  const handleImageLoad = () => {
    setLoading(false);
    setError(null);
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    setLoading(false);
    setError("Failed to load image");
    console.error("Image load error:", e);
  };

  return (
    <div className="space-y-4 p-4 border rounded-md">
      <h3 className="text-lg font-semibold">Image Test Component</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border p-2 rounded">
          <h4 className="font-medium mb-2">Direct Image</h4>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <div className="relative h-48 w-full">
            {directUrl && (
              <img
                src={directUrl}
                alt="Direct image"
                className="object-contain w-full h-full"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            )}
          </div>
          <p className="text-xs mt-2 break-all">{directUrl}</p>
        </div>

        <div className="border p-2 rounded">
          <h4 className="font-medium mb-2">Next.js Image Component</h4>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <div className="relative h-48 w-full">
            {directUrl && (
              <Image
                src={directUrl}
                alt="Next.js image"
                fill
                className="object-contain"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            )}
          </div>
          <p className="text-xs mt-2 break-all">{directUrl}</p>
        </div>
      </div>

      <div className="border p-2 rounded">
        <h4 className="font-medium mb-2">Iframe Test (to bypass CORS)</h4>
        {iframeUrl && (
          <iframe
            src={iframeUrl}
            className="w-full h-48"
            title="Image iframe"
          />
        )}
        <p className="text-xs mt-2 break-all">{iframeUrl}</p>
      </div>
    </div>
  );
}
