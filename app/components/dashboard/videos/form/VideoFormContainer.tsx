"use client";

import { Article, Video } from "@/app/lib/definition";
import VideoForm from "./VideoForm";
import { VideoCameraIcon } from "@heroicons/react/24/outline";

interface VideoFormContainerProps {
  video?: Video;
  mode: "create" | "edit";
  articles: Article[];
}

export default function VideoFormContainer({
  video,
  mode,
  articles,
}: VideoFormContainerProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Form header with gradient background */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-400">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <VideoCameraIcon className="h-6 w-6" />
          {mode === "create" ? "Create New Video" : "Edit Video"}
        </h2>
        <p className="mt-1 text-sm text-white/80">
          {mode === "edit"
            ? "Update the video's information below."
            : "Fill in the video's information below."}
        </p>
      </div>

      {/* Main form content */}
      <div className="p-6">
        <p className="text-xs mb-6">
          Fields marked with an asterisk (*) are required
        </p>
        <VideoForm video={video} mode={mode} articles={articles} />
      </div>
    </div>
  );
}
