import { XMarkIcon } from "@heroicons/react/24/outline";
import { VideoModalProps } from "./types";

export const VideoModal = ({ videoUrl, onClose }: VideoModalProps) => {
  if (!videoUrl) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 p-2 text-white hover:text-gray-300 transition-colors"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <div className="aspect-video">
          <video src={videoUrl} controls autoPlay className="w-full h-full">
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};
