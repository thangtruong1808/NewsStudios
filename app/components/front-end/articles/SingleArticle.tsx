"use client";

import { useState, useEffect } from "react";
import { getArticleById } from "@/app/lib/actions/articles";
import { getImagesByArticleId } from "@/app/lib/actions/front-end-images";
import { getVideosByArticleId } from "@/app/lib/actions/front-end-videos";
import { Article } from "@/app/lib/definition";
import { AdditionalMedia, MediaItem } from "../latest-articles/types";
import { Image } from "@/app/lib/definition";
import ArticleSkeleton from "./ArticleSkeleton";
import { TopButton } from "@/app/components/front-end/shared";

// Import subcomponents
import ArticleHeader from "./components/ArticleHeader";
import ArticleMetadata from "./components/ArticleMetadata";
import ArticleMedia from "./components/ArticleMedia";
import ArticleContent from "./components/ArticleContent";
import ArticleTags from "./components/ArticleTags";
import ArticleActions from "./components/ArticleActions";

// Define the props interface for the SingleArticle component
interface SingleArticleProps {
  articleId: number; // Required prop for the article ID
  showBackButton?: boolean; // Optional prop to control back button visibility
  onBookmark?: (articleId: number) => void; // Optional callback for bookmark action
}

export default function SingleArticle({
  articleId,
  showBackButton = false,
  onBookmark,
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
          console.log("Fetched videos:", videosResult.data);
          // Map the videos to ensure we're using video_url
          const formattedVideos = videosResult.data.map(video => ({
            id: video.id,
            url: video.video_url, // Use video_url instead of url
            description: video.description || undefined
          }));
          setVideos(formattedVideos);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch article");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  const handleImageClick = (url: string) => {
    setSelectedImage(url);
  };

  const handleVideoClick = (url: string) => {
    console.log("Handling video click with URL:", url);
    setSelectedVideo(url);
  };

  const closeVideoModal = () => {
    console.log("Closing video modal");
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
    images: images.map(img => ({
      id: img.id,
      url: img.image_url,
      description: img.description || undefined,
      isMainImage: false
    })),
    videos: videos.map(vid => ({
      id: vid.id,
      url: vid.url,
      description: vid.description || undefined
    }))
  };

  console.log("Current video state:", selectedVideo);
  console.log("Available videos:", videos);

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ArticleHeader article={article} />
        <ArticleMetadata article={article} />
        <ArticleMedia
          selectedImage={selectedImage}
          articleTitle={article.title}
          additionalMedia={additionalMedia}
          onImageClick={handleImageClick}
          onVideoClick={handleVideoClick}
          selectedVideo={selectedVideo}
          onCloseVideoModal={closeVideoModal}
          articleId={article.id}
        />
        <ArticleContent content={article.content} />
        <ArticleTags
          tags={Array.isArray(article.tag_names)
            ? article.tag_names.map((name: string, index: number) => ({
              name,
              color: article.tag_colors?.[index] || "#6B7280",
              id: article.tag_ids?.[index] || 0
            }))
            : []}
        />
        <ArticleActions
          showBackButton={showBackButton}
          isBookmarked={false}
          onBookmark={() => onBookmark?.(article.id)}
        />
      </div>
      <TopButton />
    </div>
  );
}
