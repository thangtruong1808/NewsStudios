"use client";

import { useState, useEffect } from "react";
import { getArticleById } from "@/app/lib/actions/articles";
import { getImagesByArticleId } from "@/app/lib/actions/front-end-images";
import { getVideosByArticleId } from "@/app/lib/actions/front-end-videos";
import { Article } from "@/app/lib/definition";
import type { AdditionalMedia, MediaItem } from "../latest-articles/types";
import type { Image } from "@/app/lib/definition";
import ArticleSkeleton from "./ArticleSkeleton";

// Import subcomponents
import ArticleHeader from "./components/ArticleHeader";
import ArticleMetadata from "./components/ArticleMetadata";
import ArticleMedia from "./components/ArticleMedia";
import ArticleContent from "./components/ArticleContent";
import ArticleTags from "./components/ArticleTags";
import ArticleActions from "./components/ArticleActions";

// Component Info
// Description: Render article detail view with media galleries and share actions.
// Date updated: 2025-November-21
// Author: thangtruong

// Define the props interface for the SingleArticle component
interface SingleArticleProps {
  articleId: number; // Required prop for the article ID
  showBackButton?: boolean; // Optional prop to control back button visibility
  commentsCount?: number | null; // Optional dynamic comment count for real-time updates
}

export default function SingleArticle({
  articleId,
  showBackButton = false,
  commentsCount,
}: SingleArticleProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [videos, setVideos] = useState<MediaItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        const result = await getArticleById(articleId);

        if (result.error) {
          throw new Error(result.error);
        }

        if (!result.data) {
          throw new Error("Article not found");
        }

        setArticle(result.data);
        setSelectedImage(result.data.image || null);

        // Fetch additional media
        const [imagesResult, videosResult] = await Promise.all([
          getImagesByArticleId(articleId),
          getVideosByArticleId(articleId),
        ]);

        if (imagesResult.data) {
          setImages(imagesResult.data);
        }

        if (videosResult.data) {
          type VideoRow = {
            id?: number | string;
            video_url?: string | null;
            description?: string | null;
          };

          const rawVideos = Array.isArray(videosResult.data)
            ? (videosResult.data as VideoRow[])
            : [];

          // Map the videos to ensure we're using video_url
          const formattedVideos = rawVideos.map((video) => ({
            id: Number(video.id ?? 0),
            url: typeof video.video_url === "string" ? video.video_url : "",
            description:
              typeof video.description === "string"
                ? video.description
                : undefined,
          }));
          setVideos(formattedVideos);
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch article"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  const handleImageClick = (url: string) => {
    setSelectedImage(url);
  };

  const handleVideoSelect = (url: string) => {
    setSelectedVideo(url);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  if (isLoading) {
    return <ArticleSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-xl">
        <p className="text-red-700 text-center">{error}</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="bg-yellow-50 p-6 rounded-xl">
        <p className="text-yellow-700 text-center">Article not found</p>
      </div>
    );
  }

  // Prepare additional media
  const additionalMedia: AdditionalMedia = {
    images: images.map((img) => ({
      id: img.id,
      url: img.image_url,
      description: img.description || undefined,
      isMainImage: false,
    })),
    videos: videos.map((vid) => ({
      id: vid.id,
      url: vid.url,
      description: vid.description || undefined,
    })),
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article header */}
        <ArticleHeader article={article} />
        {/* Metadata section */}
        <ArticleMetadata article={article} commentsCount={commentsCount} />
        {/* Media galleries */}
        <ArticleMedia
          selectedImage={selectedImage}
          articleTitle={article.title}
          additionalMedia={additionalMedia}
          onImageClick={handleImageClick}
          onVideoClick={handleVideoSelect}
          selectedVideo={selectedVideo}
          onCloseVideoModal={closeVideoModal}
        />
        {/* Primary content */}
        <ArticleContent content={article.content} />
        {/* Tag list */}
        <ArticleTags
          tags={Array.isArray(article.tag_names)
            ? article.tag_names.map((name: string, index: number) => ({
              name,
              color: article.tag_colors?.[index] || "#6B7280",
                id: article.tag_ids?.[index] || 0,
            }))
            : []}
        />
        {/* Actions */}
        <ArticleActions showBackButton={showBackButton} />
      </div>
    </div>
  );
}
