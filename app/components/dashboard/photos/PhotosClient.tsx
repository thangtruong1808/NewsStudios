"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
import { getImages } from "../../../lib/actions/images";

interface ImageData {
  id: number;
  article_id: number | null;
  image_url: string;
  description: string | undefined;
  created_at: string;
  updated_at: string;
}

// Placeholder image as a data URL (a simple gray square)
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23cccccc'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' fill='%23666666' text-anchor='middle' dominant-baseline='middle'%3EImage not found%3C/text%3E%3C/svg%3E";

export default function PhotosClient() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingImages, setLoadingImages] = useState<{
    [key: number]: boolean;
  }>({});
  const [failedImages, setFailedImages] = useState<{ [key: number]: boolean }>(
    {}
  );

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const result = await getImages();

        if (result.error) {
          setError(result.error);
          return;
        }

        if (result.data) {
          setImages(result.data);
          // Initialize loading state for each image
          const initialLoadingState = result.data.reduce(
            (acc: { [key: number]: boolean }, img: ImageData) => {
              acc[img.id] = true;
              return acc;
            },
            {}
          );
          setLoadingImages(initialLoadingState);
        }
      } catch (err) {
        console.error("Error fetching images:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch images");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleImageLoad = (imageId: number) => {
    setLoadingImages((prev) => ({
      ...prev,
      [imageId]: false,
    }));
    // Clear any previous failure state
    setFailedImages((prev) => ({
      ...prev,
      [imageId]: false,
    }));
  };

  const handleImageError = (imageId: number) => {
    const image = images.find((img) => img.id === imageId);
    const imageUrl = image?.image_url || "unknown";
    const processedUrl = getImageUrl(imageUrl);

    console.error(`Failed to load image with ID ${imageId}.`);
    console.error(`Original URL: ${imageUrl}`);
    console.error(`Processed URL: ${processedUrl}`);

    setLoadingImages((prev) => ({
      ...prev,
      [imageId]: false,
    }));
    // Mark this image as failed
    setFailedImages((prev) => ({
      ...prev,
      [imageId]: true,
    }));
  };

  // Function to get the image URL directly
  const getImageUrl = (originalUrl: string) => {
    console.log("Processing image URL:", originalUrl);

    // If the URL is already a full URL, return it as is
    if (originalUrl.startsWith("http")) {
      console.log("Using full URL as is:", originalUrl);
      return originalUrl;
    }

    // Handle FTP server URLs with @ symbol
    if (originalUrl.startsWith("@")) {
      const cleanUrl = originalUrl.substring(1);
      console.log("Removed @ symbol, using URL:", cleanUrl);
      return cleanUrl;
    }

    // Handle FTP server URLs without @ symbol
    if (originalUrl.includes("hstgr.io")) {
      // If it's missing the protocol, add it
      if (!originalUrl.startsWith("https://")) {
        const fullUrl = `https://${originalUrl}`;
        console.log("Added https:// to FTP URL:", fullUrl);
        return fullUrl;
      }
      console.log("Using FTP URL as is:", originalUrl);
      return originalUrl;
    }

    // For regular server URLs
    const serverUrl =
      process.env.NEXT_PUBLIC_SERVER_URL || "https://thang-truong.com";
    const fullUrl = `${serverUrl}${
      originalUrl.startsWith("/") ? "" : "/"
    }${originalUrl}`;
    console.log("Using server URL:", fullUrl);
    return fullUrl;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl">Photos</h1>
          <Link
            href="/dashboard/photos/create"
            className="flex h-10 items-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            <span className="hidden md:block">Upload Photo</span>
            <PlusIcon className="h-5 md:ml-4" />
          </Link>
        </div>
        <div className="text-center text-gray-500 p-4">
          <p>No images found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Photos</h1>
        <Link
          href="/dashboard/photos/create"
          className="flex h-10 items-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          <span className="hidden md:block">Upload Photo</span>
          <PlusIcon className="h-5 md:ml-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative aspect-square rounded-lg overflow-hidden shadow-lg bg-gray-100"
          >
            {loadingImages[image.id] && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
            {failedImages[image.id] ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center p-4">
                  <img
                    src={PLACEHOLDER_IMAGE}
                    alt="Image not found"
                    className="w-16 h-16 mx-auto mb-2 opacity-50"
                  />
                  <p className="text-red-500 text-sm font-medium">
                    Failed to load image
                  </p>
                  <p className="text-xs text-gray-500 mt-1 truncate max-w-full">
                    {image.image_url}
                  </p>
                </div>
              </div>
            ) : (
              <img
                src={getImageUrl(image.image_url)}
                alt={`Image ${image.id}`}
                className="absolute inset-0 w-full h-full object-cover"
                onLoad={() => handleImageLoad(image.id)}
                onError={() => handleImageError(image.id)}
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-xs">
              <p>ID: {image.id}</p>
              {image.article_id && <p>Article ID: {image.article_id}</p>}
              {image.description && (
                <p className="truncate mt-1 italic">"{image.description}"</p>
              )}
              <p className="truncate mt-1">
                {image.image_url.split("/").pop()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
