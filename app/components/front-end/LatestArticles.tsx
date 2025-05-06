"use client";

import { useState, useEffect } from "react";
import { getArticles } from "@/app/lib/actions/articles";
import { getImages } from "@/app/lib/actions/images";
import { getVideos } from "@/app/lib/actions/videos";
import { Article } from "@/app/lib/definition";
import Link from "next/link";
import { LoadingSpinner } from "@/app/components/shared/LoadingSpinner";
import { ArticleHeader } from "./latest-articles/ArticleHeader";
import { ArticleMetadata } from "./latest-articles/ArticleMetadata";
import { ArticleInfo } from "./latest-articles/ArticleInfo";
import { AdditionalMediaSection } from "./latest-articles/AdditionalMediaSection";
import { MainMediaDisplay } from "./latest-articles/MainMediaDisplay";
import { VideoModal } from "./latest-articles/VideoModal";
import { AdditionalMedia, MediaItem } from "./latest-articles/types";

export default function LatestArticles() {
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [additionalMedia, setAdditionalMedia] = useState<AdditionalMedia>({
    images: [],
    videos: [],
  });

  useEffect(() => {
    const fetchLatestArticle = async () => {
      try {
        const result = await getArticles();
        if (result && result.length > 0) {
          const latestArticle = [...result].sort(
            (a, b) =>
              new Date(b.published_at).getTime() -
              new Date(a.published_at).getTime()
          )[0];
          setArticle(latestArticle);
          setSelectedImage(latestArticle.image || null);

          // Fetch additional media
          const [imagesResult, videosResult] = await Promise.all([
            getImages(),
            getVideos(),
          ]);

          if (imagesResult.data) {
            const articleImages = imagesResult.data
              .filter((img) => img.article_id === latestArticle.id)
              .reduce((unique: MediaItem[], img) => {
                const exists = unique.some(
                  (item: MediaItem) => item.url === img.image_url
                );
                if (!exists) {
                  unique.push({ id: img.id, url: img.image_url });
                }
                return unique;
              }, []);

            setAdditionalMedia((prev) => ({ ...prev, images: articleImages }));
          }

          if (videosResult.data) {
            const articleVideos = videosResult.data
              .filter((vid) => vid.article_id === latestArticle.id)
              .reduce((unique: MediaItem[], vid) => {
                const exists = unique.some(
                  (item: MediaItem) => item.url === vid.video_url
                );
                if (!exists) {
                  unique.push({ id: vid.id, url: vid.video_url });
                }
                return unique;
              }, []);

            setAdditionalMedia((prev) => ({ ...prev, videos: articleVideos }));
          }
        }
      } catch (error) {
        console.error("Error fetching article:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch article"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestArticle();
  }, []);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleVideoClick = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No articles found.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Link href={`/article/${article.id}`} className="block group w-full">
        <ArticleHeader title={article.title} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Text Content */}
          <div className="space-y-4">
            <p className="text-gray-600 line-clamp-4">{article.content}</p>
            <ArticleMetadata article={article} />
            <ArticleInfo article={article} />
            <AdditionalMediaSection
              media={additionalMedia}
              onImageClick={handleImageClick}
              onVideoClick={handleVideoClick}
            />
          </div>

          {/* Media Content */}
          <div className="space-y-4">
            <MainMediaDisplay selectedImage={selectedImage} article={article} />
          </div>
        </div>
      </Link>

      <VideoModal videoUrl={selectedVideo} onClose={closeVideoModal} />
    </div>
  );
}
