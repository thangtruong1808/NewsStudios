"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getAllVideos } from "@/app/lib/actions/front-end-videos";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon } from "@heroicons/react/24/outline";
import VideoCarouselSkeleton from "./VideoCarouselSkeleton";
import VideoModal from "./VideoModal";

interface Video {
  id: number;
  article_id: number;
  video_url: string;
  description: string | null;
  article_title: string;
  updated_at: string;
}

export default function VideoCarousel() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        const result = await getAllVideos();

        if (result.error) {
          throw new Error(result.error);
        }

        setVideos(result.data || []);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch videos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Set video thumbnails
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video && videos[index]) {
        video.src = videos[index].video_url;
        video.currentTime = 1; // Set to 1 second to get a good thumbnail
      }
    });
  }, [videos]);

  const nextVideo = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === videos.length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, videos.length]);

  const prevVideo = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? videos.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  // Auto-slide functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying && !isHovering) {
      interval = setInterval(nextVideo, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovering, nextVideo]);

  const handleVideoClick = (index: number) => {
    setSelectedVideoIndex(index);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedVideoIndex(null);
  };

  if (isLoading) {
    return <VideoCarouselSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No videos available.</p>
      </div>
    );
  }

  const currentVideo = videos[currentIndex];

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-lg bg-gray-100">
      <div
        className="relative h-full w-full"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Video Player Container */}
        <div className="relative h-full w-full">
          <div className="relative h-full w-full">
            <video
              src={currentVideo.video_url}
              className="h-full w-full object-cover"
            />
            <button
              onClick={() => handleVideoClick(currentIndex)}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-all duration-300"
              aria-label="Play video"
            >
              <PlayIcon className="h-16 w-16 text-white" />
            </button>
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-5">
            <h3 className="text-md font-bold text-white mb-1">
              <span className="text-gray-200 text-sm ml-1">
                <CalendarIcon className="inline-block h-4 w-4 mr-1" />
                {new Date(currentVideo.updated_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                <span> - </span></span>{currentVideo.article_title}
            </h3>
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevVideo}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all duration-300"
          aria-label="Previous video"
        >
          <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
        </button>
        <button
          onClick={nextVideo}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all duration-300"
          aria-label="Next video"
        >
          <ChevronRightIcon className="h-6 w-6 text-gray-700" />
        </button>

        {/* Auto-play Toggle */}
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all duration-300"
          aria-label={isAutoPlaying ? "Pause auto-play" : "Start auto-play"}
        >
          {isAutoPlaying ? (
            <PauseIcon className="h-5 w-5 text-gray-700" />
          ) : (
            <PlayIcon className="h-5 w-5 text-gray-700" />
          )}
        </button>

        {/* Thumbnails Strip */}
        <div className="absolute bottom-16 left-0 right-0 bg-black/30 p-2">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {videos.map((video, index) => (
              <div key={video.id} className="relative group">
                <div className="relative aspect-video w-24 overflow-hidden rounded-lg">
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
                      if (isTransitioning) return;
                      setIsTransitioning(true);
                      setCurrentIndex(index);
                      handleVideoClick(index);
                      setTimeout(() => setIsTransitioning(false), 500);
                    }}
                    className={`absolute inset-0 w-full flex items-center justify-center ${index === currentIndex ? 'ring-2 ring-white' : ''}`}
                  >
                    <PlayIcon className="h-6 w-6 text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (isTransitioning) return;
                setIsTransitioning(true);
                setCurrentIndex(index);
                setTimeout(() => setIsTransitioning(false), 500);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-white w-4" : "bg-white/50"
                }`}
              aria-label={`Go to video ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        videoUrl={selectedVideoIndex !== null ? videos[selectedVideoIndex].video_url : currentVideo.video_url}
        title={selectedVideoIndex !== null ? videos[selectedVideoIndex].article_title : currentVideo.article_title}
      />
    </div>
  );
} 