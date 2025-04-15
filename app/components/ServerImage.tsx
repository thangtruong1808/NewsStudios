import { useState } from "react";

// Placeholder image URL - a simple gray image that will be shown when the actual image fails to load
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23cccccc'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' fill='%23666666' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";

interface ServerImageProps {
  imageData: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  useDirectUrl?: boolean;
}

export default function ServerImage({
  imageData,
  alt,
  width,
  height,
  className = "",
  useDirectUrl = false,
}: ServerImageProps) {
  const [error, setError] = useState(false);

  // Function to determine the image source
  const getImageSource = () => {
    // If it's a base64 string, use it directly
    if (imageData.startsWith("data:")) {
      return imageData;
    }

    // If useDirectUrl is true, use the URL directly
    if (useDirectUrl) {
      return imageData;
    }

    // For external URLs, use the proxy API
    if (imageData.startsWith("http")) {
      const encodedUrl = encodeURIComponent(imageData);
      return `/api/proxy-image?url=${encodedUrl}`;
    }

    // For relative paths, construct the full URL and use the proxy API
    const serverUrl =
      "https://srv876-files.hstgr.io/83e36b91bb471f62/files/public_html";
    const fullUrl = `${serverUrl}${
      imageData.startsWith("/") ? "" : "/"
    }${imageData}`;
    const encodedUrl = encodeURIComponent(fullUrl);
    return `/api/proxy-image?url=${encodedUrl}`;
  };

  const imageSource = getImageSource();
  const isBase64 = imageSource.startsWith("data:");

  if (error) {
    return (
      <img
        src={PLACEHOLDER_IMAGE}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    );
  }

  // Always use a regular img tag to avoid Next.js Image component issues
  return (
    <img
      src={imageSource}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setError(true)}
      loading="eager"
    />
  );
}
