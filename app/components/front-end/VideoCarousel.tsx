"use client";

// Component Info
// Description: Enhanced video carousel with smooth transitions, keyboard navigation, improved styling, and better UX.
// Date created: 2025-01-27
// Author: thangtruong

import { useState, useEffect, useCallback, useRef } from "react";
import { getAllVideos } from "@/app/lib/actions/front-end-videos";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
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

// Header component
const VideoHeader = () => (
  <div className="w-screen bg-violet-100 relative left-1/2 right-1/2 -mx-[50vw] mb-8">
    <div className="max-w-[1536px] mx-auto px-6">
      <div className="py-8">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 shadow-sm">
            <PlayIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Latest Videos</h2>
            <p className="text-sm text-gray-600 mt-1">Watch our featured video content</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

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
  const carouselRef = useRef<HTMLDivElement>(null);

  // Fetch videos on mount
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        const { data, error: fetchError } = await getAllVideos();
        if (fetchError) throw new Error(fetchError);
        setVideos(Array.isArray(data) ? (data as Video[]) : []);
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
        video.currentTime = 1;
      }
    });
  }, [videos]);

  // Navigate to video with transition guard
  const goToVideo = useCallback((newIndex: number) => {
    if (isTransitioning || videos.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex(newIndex);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, videos.length]);

  const nextVideo = useCallback(() => {
    goToVideo((currentIndex + 1) % videos.length);
  }, [currentIndex, videos.length, goToVideo]);

  const prevVideo = useCallback(() => {
    goToVideo((currentIndex - 1 + videos.length) % videos.length);
  }, [currentIndex, videos.length, goToVideo]);

  // Handle keyboard navigation when carousel is focused
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isFocused = carouselRef.current?.contains(document.activeElement) ||
        document.activeElement === carouselRef.current;
      if (!isFocused) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        prevVideo();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        nextVideo();
      }
    };

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("keydown", handleKeyDown);
      return () => carousel.removeEventListener("keydown", handleKeyDown);
    }
  }, [nextVideo, prevVideo]);

  // Auto-slide functionality (pauses on hover)
  useEffect(() => {
    if (!isAutoPlaying || isHovering || videos.length <= 1) return;
    const interval = setInterval(nextVideo, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovering, nextVideo, videos.length]);

  const handleVideoClick = (index: number) => {
    setSelectedVideoIndex(index);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedVideoIndex(null);
  };

  // Helper functions
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return '';
    }
  };
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToBottom = () => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });

  if (isLoading) return <VideoCarouselSkeleton />;
  if (error) return <div className="bg-red-50 p-4 rounded-md"><p className="text-red-700">{error}</p></div>;
  if (videos.length === 0) {
    return (
      <div className="w-screen bg-slate-100 relative left-1/2 right-1/2 -mx-[50vw] mb-8">
        <div className="max-w-[1536px] mx-auto px-6">
          <VideoHeader />
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-100">
                <PlayIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">No Videos Available</h3>
              <p className="text-gray-500 max-w-md">We&apos;re currently working on adding new video content. Please check back soon!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentVideo = videos[currentIndex];

  return (
    <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw]">
      <div className="max-w-[1536px] mx-auto px-6">
        <VideoHeader />

        {/* Video carousel container */}
        <div className="relative h-[400px] w-full overflow-hidden rounded-lg bg-gray-100 shadow-xl">
          <div
            ref={carouselRef}
            className="relative h-full w-full"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            tabIndex={0}
            role="region"
            aria-label="Video carousel"
          >
            {/* Video player container */}
            <div className="relative h-full w-full overflow-hidden">
              <video src={currentVideo.video_url} className="h-full w-full object-cover" muted playsInline />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <button onClick={() => handleVideoClick(currentIndex)} className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-all duration-300 group" aria-label="Play video">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                  <PlayIcon className="h-16 w-16 text-white" />
                </div>
              </button>
              {/* Title overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 pb-8">
                {currentVideo.updated_at && (
                  <div className="flex items-center gap-2 text-white/90 text-sm mb-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{formatDate(currentVideo.updated_at)}</span>
                  </div>
                )}
                <h3 className="text-white font-bold"><span className="line-clamp-2 text-lg md:text-xl">{currentVideo.article_title}</span></h3>
              </div>
            </div>

            {/* Navigation controls */}
            {videos.length > 1 && (
              <>
                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); prevVideo(); }} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-900 p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 z-10 focus:outline-none focus:ring-2 focus:ring-white/50" aria-label="Previous video">
                  <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); nextVideo(); }} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-900 p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 z-10 focus:outline-none focus:ring-2 focus:ring-white/50" aria-label="Next video">
                  <ChevronRightIcon className="w-6 h-6" />
                </button>
              </>
            )}
            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsAutoPlaying(!isAutoPlaying); }} className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 z-10 focus:outline-none focus:ring-2 focus:ring-white/50" aria-label={isAutoPlaying ? "Pause auto-play" : "Start auto-play"}>
              {isAutoPlaying ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
            </button>

            {/* Thumbnails strip */}
            {videos.length > 1 && (
              <div className="absolute bottom-16 left-0 right-0 bg-black/40 backdrop-blur-sm p-3">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {videos.map((video, index) => (
                    <div key={video.id} className="relative group flex-shrink-0">
                      <div className={`relative aspect-video w-28 overflow-hidden rounded-lg transition-all duration-200 ${index === currentIndex ? 'ring-2 ring-white shadow-lg scale-105' : 'opacity-70 hover:opacity-100'}`}>
                        <video ref={el => videoRefs.current[index] = el} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300" />
                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); goToVideo(index); handleVideoClick(index); }} className="absolute inset-0 w-full flex items-center justify-center">
                          <PlayIcon className="h-6 w-6 text-white" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Slide indicators */}
            {videos.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {videos.map((_, index) => (
                  <button key={index} onClick={(e) => { e.preventDefault(); e.stopPropagation(); goToVideo(index); }} className={`transition-all duration-200 rounded-full ${index === currentIndex ? "w-8 h-2 bg-white shadow-md" : "w-2 h-2 bg-white/60 hover:bg-white/80"}`} aria-label={`Go to video ${index + 1}`} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Scroll buttons */}
        <button onClick={scrollToTop} className="fixed bottom-24 right-6 z-50 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" aria-label="Scroll to top">
          <ArrowUpIcon className="h-6 w-6" />
        </button>
        <button onClick={scrollToBottom} className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" aria-label="Scroll to bottom">
          <ArrowDownIcon className="h-6 w-6" />
        </button>

        {/* Video modal */}
        <VideoModal isOpen={isModalOpen} onClose={handleModalClose} videoUrl={selectedVideoIndex !== null ? videos[selectedVideoIndex].video_url : currentVideo.video_url} title={selectedVideoIndex !== null ? videos[selectedVideoIndex].article_title : currentVideo.article_title} />
      </div>
    </div>
  );
} 