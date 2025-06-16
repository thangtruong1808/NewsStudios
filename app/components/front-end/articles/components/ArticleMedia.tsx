"use client";

import { useState } from "react";
import Image from "next/image";
import { PlayIcon } from "@heroicons/react/24/solid";
import { VideoModal } from "../../latest-articles/VideoModal";
import { ArticleMediaProps } from "../types";

const ArticleMedia = ({
  selectedImage,
  articleTitle,
  additionalMedia,
  onImageClick,
  onVideoClick,
  selectedVideo,
  onCloseVideoModal,
  articleId,
}: ArticleMediaProps) => {
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [currentMainImage, setCurrentMainImage] = useState<string>(selectedImage || '');

  // Filter out duplicate images
  const uniqueImages = additionalMedia.images.filter(
    (image, index, self) =>
      index === self.findIndex((img) => img.url === image.url)
  );

  const handleImageClick = (url: string) => {
    setSelectedImageUrl(url);
    onImageClick(url);
  };

  const handleAdditionalImageClick = (url: string) => {
    setCurrentMainImage(url);
  };

  const handleVideoClick = (url: string) => {
    console.log("Video clicked with URL:", url);
    onVideoClick(url);
  };

  const handleCloseImage = () => {
    setSelectedImageUrl(null);
  };

  // If there's no media to display, return null
  if (!selectedImage && additionalMedia.images.length === 0 && additionalMedia.videos.length === 0) {
    return null;
  }

  // Check if there's exactly one image and one video
  const hasOneImageAndOneVideo = uniqueImages.length === 1 && additionalMedia.videos.length === 1;
  // Check if there's exactly one image and no video
  const hasOneImageAndNoVideo = uniqueImages.length === 1 && additionalMedia.videos.length === 0;

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
              className="object-cover rounded-lg cursor-pointer"
              onClick={() => handleImageClick(currentMainImage)}
            />
          </div>
        )}

        {/* Right Side Content - Only show if not in one-image-no-video case */}
        {!hasOneImageAndNoVideo && (
          <div className="w-1/5 flex flex-col gap-4">
            {/* Video Button */}
            {additionalMedia.videos.length > 0 && (
              <div className="flex items-center">
                <button
                  onClick={() => {
                    const videoUrl = additionalMedia.videos[0].url;
                    if (videoUrl) handleVideoClick(videoUrl);
                  }}
                  className="w-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <PlayIcon className="h-8 w-8" />
                  <span className="text-sm font-medium">Watch Video</span>
                </button>
              </div>
            )}

            {/* Additional Media Grid - Only show if not in one-image-one-video case */}
            {!hasOneImageAndOneVideo && additionalMedia.images.length > 0 && (
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
};

export default ArticleMedia;
