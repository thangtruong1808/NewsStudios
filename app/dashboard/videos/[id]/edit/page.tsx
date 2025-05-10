"use client";

import React from "react";
import { useParams } from "next/navigation";
import VideoForm from "../../../../components/dashboard/videos/VideoForm";
import { getVideoById } from "../../../../lib/actions/videos";
import { getArticles } from "../../../../lib/actions/articles";
import { Video } from "../../../../lib/definition";

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
  const [articles, setArticles] = React.useState<
    { id: number; title: string }[]
  >([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [videoResult, articlesResult] = await Promise.all([
          getVideoById(videoId),
          getArticles(),
        ]);

        if (videoResult.error) {
          setError(videoResult.error);
        } else if (videoResult.data) {
          // Serialize the video data before setting it in state
          setVideo(serializeVideo(videoResult.data));
        }

        if (Array.isArray(articlesResult)) {
          setArticles(
            articlesResult.map((article) => ({
              id: article.id,
              title: article.title,
            }))
          );
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
      <VideoForm video={video} articles={articles} />
    </div>
  );
}
