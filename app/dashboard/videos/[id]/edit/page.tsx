"use client";

import React from "react";
import { useParams } from "next/navigation";
import VideoForm from "@/app/components/dashboard/videos/form/VideoForm";
import { getVideoById } from "@/app/lib/actions/videos";
import { Video } from "@/app/lib/definition";
import { notFound } from "next/navigation";

// Helper function to serialize dates in the video object
function serializeVideo(video: Video) {
  return {
    ...video,
    created_at:
      typeof video.created_at === "string"
        ? video.created_at
        : new Date(video.created_at).toISOString(),
    updated_at:
      typeof video.updated_at === "string"
        ? video.updated_at
        : new Date(video.updated_at).toISOString(),
  };
}

export default function EditVideoPage() {
  const params = useParams();
  const videoId = Number(params.id);
  const [video, setVideo] = React.useState<Video | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const videoResult = await getVideoById(videoId);

        if (videoResult.error) {
          setError(videoResult.error);
        } else if (videoResult.data) {
          // Serialize the video data before setting it in state
          setVideo(serializeVideo(videoResult.data));
        }
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      <VideoForm video={video} mode="edit" />
    </div>
  );
}
