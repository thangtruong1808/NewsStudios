import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}

export default function VideoModal({ isOpen, onClose, videoUrl, title }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnd = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative w-full max-w-4xl mx-4">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300"
          aria-label="Close video"
        >
          <XMarkIcon className="h-8 w-8" />
        </button>
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            autoPlay
            onEnded={handleVideoEnd}
            className="w-full h-full"
          />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
      </div>
    </div>
  );
} 