"use client";

import { useState } from "react";
import { PlayIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import { VideoModal } from "../../latest-articles/VideoModal";
import { AdditionalMedia } from "../../latest-articles/types";

interface ArticleMediaProps {
  selectedImage: string | null;
  articleTitle: string;
  additionalMedia: AdditionalMedia;
  onImageClick: (url: string) => void;
  onVideoClick: (url: string) => void;
  selectedVideo: string | null;
  onCloseVideoModal: () => void;
  articleId: number;
}

interface AdditionalMediaSectionProps {
  additionalMedia: AdditionalMedia;
  onImageClick: (url: string) => void;
  onVideoClick: (url: string) => void;
}

const AdditionalMediaSection = ({
  additionalMedia,
  onImageClick,
  onVideoClick,
}: AdditionalMediaSectionProps) => {
  const { images, videos } = additionalMedia;

  // Filter out duplicate image URLs
  const uniqueImages = images.filter((image, index, self) =>
    index === self.findIndex((img) => img.url === image.url)
  );

  if (uniqueImages.length === 0 && videos.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Media Gallery
      </h3>
      <div className="max-h-[600px] overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Images */}
          {uniqueImages.map((item) => (
            <div
              key={`image-${item.id}`}
              className="relative aspect-[4/3] rounded-lg overflow-hidden group hover:shadow-lg transition-shadow duration-300"
            >
              <div
                className="w-full h-full cursor-pointer"
                onClick={() => onImageClick(item.url)}
              >
                <img
                  src={item.url}
                  alt={item.description || "Additional media"}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          ))}

          {/* Videos */}
          {videos.map((item) => (
            <div
              key={`video-${item.id}`}
              className="relative aspect-[4/3] rounded-lg overflow-hidden group hover:shadow-lg transition-shadow duration-300"
            >
              <div
                className="w-full h-full bg-gray-100 cursor-pointer relative"
                onClick={() => onVideoClick(item.url)}
              >
                {/* Video Thumbnail Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-90" />

                {/* Video Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <PlayIcon className="h-8 w-8 text-white" />
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function ArticleMedia({
  selectedImage,
  articleTitle,
  additionalMedia,
  onImageClick,
  onVideoClick,
  selectedVideo,
  onCloseVideoModal,
  articleId,
}: ArticleMediaProps) {
  // Filter out duplicate image URLs from additionalMedia
  const filteredAdditionalMedia = {
    ...additionalMedia,
    images: additionalMedia.images.filter((image, index, self) =>
      index === self.findIndex((img) => img.url === image.url)
    )
  };

  const hasMedia =
    selectedImage ||
    filteredAdditionalMedia.images.length > 0 ||
    filteredAdditionalMedia.videos.length > 0;

  if (!hasMedia) {
    return null;
  }

  // Check if there's only one image (same as main image) and no videos
  const isSingleImage =
    selectedImage &&
    ((filteredAdditionalMedia.images.length === 0 &&
      filteredAdditionalMedia.videos.length === 0) ||
      (filteredAdditionalMedia.images.length === 1 &&
        filteredAdditionalMedia.images[0].url === selectedImage &&
        filteredAdditionalMedia.videos.length === 0));

  return (
    <div
      className={`grid ${
        isSingleImage ? "grid-cols-1" : "grid-cols-1 md:grid-cols-4"
      } gap-4 mb-8`}
    >
      {/* Main Image Column */}
      <div className={isSingleImage ? "w-full" : "md:col-span-3"}>
        {selectedImage && (
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <img
              src={selectedImage}
              alt={articleTitle}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Additional Media Column - Only show if not a single image */}
      {!isSingleImage && (
        <div className="md:col-span-1">
          <AdditionalMediaSection
            additionalMedia={filteredAdditionalMedia}
            onImageClick={onImageClick}
            onVideoClick={onVideoClick}
          />
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal videoUrl={selectedVideo} onClose={onCloseVideoModal} />
      )}
    </div>
  );
}
