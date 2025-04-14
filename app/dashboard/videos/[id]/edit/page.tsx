"use client";

import React from "react";
import { useParams } from "next/navigation";
import VideoForm from "../../../../components/dashboard/videos/VideoForm";
import { getVideoById } from "../../../../lib/actions/videos";
import { getArticles } from "../../../../lib/actions/articles";
import { Video } from "../../../../lib/definition";

export default function EditVideoPage() {
  const params = useParams();
  const videoId = Number(params.id);
  const [video, setVideo] = React.useState<Video | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchVideo = async () => {
      try {
        const result = await getVideoById(videoId);
        if (result.error) {
          setError(result.error);
        } else {
          setVideo(result.data);
        }
      } catch (err) {
        setError("Failed to fetch video");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!video) {
    return <div>Video not found</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Edit Video</h1>
      </div>
      <VideoForm video={video} />
    </div>
  );
}
