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
    <div className="w-full">
      <VideoFormContainer
        video={video}
        mode={video ? "edit" : "create"}
        articles={articles}
      />
    </div>
  );
}
