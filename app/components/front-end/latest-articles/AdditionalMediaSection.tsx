"use client";

import { useEffect, useState } from "react";
import { getImagesByArticleId } from "@/app/lib/actions/front-end-images";
import { MediaThumbnail } from "./MediaThumbnail";
import { AdditionalMediaSectionProps } from "./types";
import { LoadingSpinner } from "@/app/components/dashboard/shared/loading-spinner";

interface ImageItem {
  id: number;
  url: string;
  description?: string;
  type?: string;
}

export const AdditionalMediaSection = ({
  media,
  onImageClick,
  onVideoClick,
  articleId,
}: AdditionalMediaSectionProps & { articleId: number }) => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const result = await getImagesByArticleId(articleId);

        if (result.error) {
          throw new Error(result.error);
        }

        if (result.data) {
          console.log("Received images from server:", result.data); // Debug log
          const formattedImages = result.data.map((img) => ({
            id: img.id,
            url: img.image_url,
            description: img.description || undefined,
            type: img.type,
          }));
          console.log("Formatted images:", formattedImages); // Debug log
          setImages(formattedImages);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch images");
        console.error("Error fetching images:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [articleId]);

  // Debug log for current images state
  useEffect(() => {
    console.log("Current images state:", images);
  }, [images]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        <p>{error}</p>
      </div>
    );
  }

  if (images.length === 0 && media.videos.length === 0) return null;

  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">
        Media Gallery ({images.length} images)
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
        {images.map((image) => (
          <MediaThumbnail
            key={`image-${image.id}`}
            type="image"
            item={image}
            onClick={onImageClick}
          />
        ))}
        {media.videos.map((video) => (
          <MediaThumbnail
            key={`video-${video.id}`}
            type="video"
            item={video}
            onClick={onVideoClick}
          />
        ))}
      </div>
    </div>
  );
};
