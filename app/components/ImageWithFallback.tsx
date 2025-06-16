"use client";

import React, { useState } from "react";
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
      console.log("Proxy image failed, trying direct URL");
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
