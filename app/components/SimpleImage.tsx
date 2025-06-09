"use client";

import React, { useState, useEffect } from "react";
import { constructImageUrl, isExternalUrl } from "../lib/utils/imageUtils";
import { isCloudinaryUrl } from "../lib/utils/cloudinaryUtils";

// Placeholder image (base64 SVG)
const placeholderImage =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+";

interface SimpleImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  useProxy?: boolean;
  useIframe?: boolean;
  useBase64?: boolean;
}

const SimpleImage: React.FC<SimpleImageProps> = ({
  src,
  alt,
  width = 400,
  height = 200,
  className = "",
  useProxy = true,
  useIframe = false,
  useBase64 = false,
}) => {
  const [imgSrc, setImgSrc] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [iframeKey, setIframeKey] = useState<number>(0);

  useEffect(() => {
    const processImage = async () => {
      try {
        if (!src) {
          setError("No image source provided");
          return;
        }

        if (isCloudinaryUrl(src)) {
          const shouldUseProxy = useProxy && !isBase64Url(src);
          if (shouldUseProxy) {
            const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(src)}`;
            setImgSrc(proxyUrl);
            return;
          }
          setImgSrc(src);
          return;
        }

        if (isBase64Url(src)) {
          const base64Url = `/api/base64-image?data=${encodeURIComponent(src)}`;
          setImgSrc(base64Url);
          return;
        }

        const constructedUrl = constructImageUrl(src);
        setImgSrc(constructedUrl);
      } catch (error) {
        setError("Error processing image");
      }
    };

    processImage();
  }, [src, useProxy]);

  const handleError = () => {
    console.error("SimpleImage: Error loading image:", imgSrc);
    setError(true);
    setImgSrc(placeholderImage);
    setDebugInfo(`Failed to load image: ${imgSrc}`);
  };

  const handleLoad = () => {
    console.log("SimpleImage: Image loaded successfully:", imgSrc);
    setLoading(false);
    setError(false);
  };

  // If using iframe approach for Hostinger images
  if (useIframe && isExternalUrl(src)) {
    return (
      <div className="relative" style={{ width, height }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        <iframe
          key={iframeKey}
          src={src}
          title={alt}
          width={width}
          height={height}
          className={`${className} ${error ? "opacity-50" : ""}`}
          onLoad={() => setLoading(false)}
          onError={handleError}
          style={{ border: "none", overflow: "hidden" }}
        />
        {debugInfo && (
          <div className="mt-2 text-xs text-gray-500">
            <p>{debugInfo}</p>
            {error && <p className="text-red-500">Error loading image</p>}
          </div>
        )}
      </div>
    );
  }

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

export default SimpleImage;
