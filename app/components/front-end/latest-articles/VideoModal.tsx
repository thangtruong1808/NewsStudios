"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { VideoModalProps } from "./types";
import { useEffect, useRef, useState } from "react";

export const VideoModal = ({ videoUrl, onClose }: VideoModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!videoUrl) return;

    console.log("VideoModal mounted with URL:", videoUrl);

    // Set up video event listeners
    const videoElement = videoRef.current;
    if (videoElement) {
      const handlePlay = () => {
        console.log("Video started playing");
        setIsPlaying(true);
      };

      const handlePause = () => {
        console.log("Video paused");
        setIsPlaying(false);
      };

      const handleEnded = () => {
        console.log("Video ended");
        setIsPlaying(false);
      };

      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('pause', handlePause);
      videoElement.addEventListener('ended', handleEnded);

      // Cleanup function
      return () => {
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('pause', handlePause);
        videoElement.removeEventListener('ended', handleEnded);
        videoElement.pause();
        videoElement.currentTime = 0;
      };
    }
  }, [videoUrl]);

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    onClose();
  };

  if (!videoUrl) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 z-10 p-2 text-white hover:text-gray-300 transition-colors"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <div className="aspect-video">
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            playsInline
            className="w-full h-full"
            onError={(e) => {
              console.error("Video playback error:", e);
              handleClose();
            }}
            onLoadedData={() => {
              console.log("Video data loaded successfully");
              // Only attempt to play if not already playing
              if (!isPlaying && videoRef.current) {
                videoRef.current.play().catch(error => {
                  console.error("Error playing video:", error);
                });
              }
            }}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};
