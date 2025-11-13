"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PlayIcon } from "@heroicons/react/24/solid";
import { VideoModal } from "../../latest-articles/VideoModal";
import type { ArticleMediaProps } from "../types";

// Description: Display article media gallery with main image, thumbnails, and video previews.
// Data created: 2024-11-13
// Author: thangtruong
function ArticleMedia({
  selectedImage,
  articleTitle,
  additionalMedia,
  onImageClick,
  onVideoClick,
  selectedVideo,
  onCloseVideoModal,
}: ArticleMediaProps) {
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [currentMainImage, setCurrentMainImage] = useState<string>(selectedImage || '');
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Filter out duplicate images
  const uniqueImages = additionalMedia.images.filter(
    (image, index, self) =>
      index === self.findIndex((img) => img.url === image.url)
  );

  // Set video thumbnails
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video && additionalMedia.videos[index]) {
        video.src = additionalMedia.videos[index].url;
        video.currentTime = 1; // Set to 1 second to get a good thumbnail
      }
    });
  }, [additionalMedia.videos]);

  const handleImageClick = (url: string) => {
    setSelectedImageUrl(url);
    onImageClick(url);
  };

  const handleAdditionalImageClick = (url: string) => {
    setCurrentMainImage(url);
  };

  const handleVideoClick = (url: string) => {
    onVideoClick(url);
  };

  const handleCloseImage = () => {
    setSelectedImageUrl(null);
  };

  // If there's no media to display, return null
  if (!selectedImage && additionalMedia.images.length === 0 && additionalMedia.videos.length === 0) {
    return null;
  }

  // Check if there's exactly one image and no video
  const hasOneImageAndNoVideo = uniqueImages.length === 1 && additionalMedia.videos.length === 0;
  // Check if there's one image and one or more videos
  const hasOneImageAndVideos = uniqueImages.length === 1 && additionalMedia.videos.length >= 1;

  return (
    <div className="space-y-4">
      {/* Main Content Section */}
      <div className="flex gap-4">
        {/* Main Image */}
        {currentMainImage && (
          <div className={`relative ${hasOneImageAndNoVideo ? 'w-full' : 'w-4/5'} h-[400px] md:h-[500px] lg:h-[600px]`}>
            <Image
              src={currentMainImage}
              alt={articleTitle || "Article image"}
              fill
              priority
              className="object-cover rounded-lg cursor-pointer"
              onClick={() => handleImageClick(currentMainImage)}
            />
          </div>
        )}

        {/* Right Side Content - Only show if not in one-image-no-video case */}
        {!hasOneImageAndNoVideo && (
          <div className="w-1/5 flex flex-col gap-4">
            {/* Video Buttons - Show one button per video */}
            {additionalMedia.videos.length > 0 && (
              <div className="flex flex-col gap-2">
                {additionalMedia.videos.map((video, index) => (
                  <div key={video.id} className="relative group">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                      <video
                        ref={el => videoRefs.current[index] = el}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        preload="metadata"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />
                      <button
                        onClick={() => {
                          if (video.url) handleVideoClick(video.url);
                        }}
                        className="absolute inset-0 w-full flex items-center justify-center gap-2 text-white"
                      >
                        <PlayIcon className="h-8 w-8" />
                        <span className="text-sm font-medium">Watch Video {index + 1}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Additional Media Grid - Only show if not in one-image-and-videos case */}
            {!hasOneImageAndVideos && additionalMedia.images.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {uniqueImages.map((image, index) => (
                  <div
                    key={image.id}
                    className={`relative aspect-square cursor-pointer ${currentMainImage === image.url ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => handleAdditionalImageClick(image.url)}
                  >
                    <Image
                      src={image.url}
                      alt={`Additional image ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal videoUrl={selectedVideo} onClose={onCloseVideoModal} />
      )}

      {/* Image Modal */}
      {selectedImageUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={handleCloseImage}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <Image
              src={selectedImageUrl}
              alt="Selected image"
              width={1200}
              height={800}
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ArticleMedia;
