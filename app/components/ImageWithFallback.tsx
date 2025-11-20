"use client";

// Component Info
// Description: Image component with fallback mechanism to handle proxy URL failures by switching to direct URL.
// Date updated: 2025-November-21
// Author: thangtruong

import { useState } from "react";
import Image from "next/image";

interface ImageWithFallbackProps {
  proxyUrl: string;
  directUrl: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export default function ImageWithFallback({
  proxyUrl,
  directUrl,
  alt,
  width,
  height,
  className = "",
}: ImageWithFallbackProps) {
  const [src, setSrc] = useState(proxyUrl);
  const [error, setError] = useState(false);

  const handleError = () => {
    if (!error) {
      setSrc(directUrl);
      setError(true);
    }
  };

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onError={handleError}
      referrerPolicy="no-referrer"
      crossOrigin="anonymous"
    />
  );
}
