"use client";

import { Video } from "@/app/lib/definition";
import VideoForm from "./VideoForm";

interface VideoFormContainerProps {
  video?: Video;
  mode: "create" | "edit";
}

export default function VideoFormContainer({
  video,
  mode,
}: VideoFormContainerProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Form header with gradient background */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-400">
        <h2 className="text-lg font-medium text-white">
          {mode === "edit" ? "Edit Video" : "Create Video"}
        </h2>
        <p className="mt-1 text-sm text-white/80">
          {mode === "edit"
            ? "Update the video's information below."
            : "Fill in the video's information below."}
        </p>
      </div>

      {/* Main form content */}
      <div className="p-6">
        <p className="text-xs text-gray-500 mb-6">
          Fields marked with an asterisk (*) are required
        </p>
        <VideoForm video={video} mode={mode} />
      </div>
    </div>
  );
}
