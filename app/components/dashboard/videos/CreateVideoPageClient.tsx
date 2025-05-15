"use client";

import { Article } from "@/app/lib/definition";
import { Video } from "@/app/lib/definition";
import VideoFormContainer from "./form/VideoFormContainer";

interface CreateVideoPageClientProps {
  articles: Article[];
  video?: Video;
}

export default function CreateVideoPageClient({
  articles,
  video,
}: CreateVideoPageClientProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-2">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <VideoFormContainer video={video} mode={video ? "edit" : "create"} />
        </div>
      </div>
    </div>
  );
}
