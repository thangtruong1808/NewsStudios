"use client";

import { useState, useEffect } from "react";
import { getArticleById } from "@/app/lib/actions/articles";
import { getImagesByArticleId } from "@/app/lib/actions/front-end-images";
import { getVideosByArticleId } from "@/app/lib/actions/front-end-videos";
import { Article } from "@/app/lib/definition";
import { LoadingSpinner } from "@/app/components/dashboard/shared/loading-spinner";
import { AdditionalMedia, MediaItem } from "../latest-articles/types";
import { Image } from "@/app/lib/definition";

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
  showBackButton = true, // Default to true
  onBookmark,
}: SingleArticleProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [additionalMedia, setAdditionalMedia] = useState<AdditionalMedia>({
    images: [],
    videos: [],
  });

  const fetchAdditionalMedia = async (
    articleId: number,
    mainImage: string | null
  ) => {
    try {
      // Fetch both images and videos for the specific article
      const [imagesResult, videosResult] = await Promise.all([
        getImagesByArticleId(articleId),
        getVideosByArticleId(articleId),
      ]);

      let articleImages: MediaItem[] = [];
      let articleVideos: MediaItem[] = [];

      // Handle images
      if (imagesResult.data) {
        // Create a Set to track unique image URLs
        const uniqueUrls = new Set<string>();

        // Filter out duplicate images and map to MediaItem format
        articleImages = imagesResult.data
          .filter((img: Image) => {
            // Skip if we've seen this URL before
            if (uniqueUrls.has(img.image_url)) {
              return false;
            }
            // Add URL to set and include the image
            uniqueUrls.add(img.image_url);
            return true;
          })
          .map((img: Image) => ({
            id: img.id,
            url: img.image_url,
            description: img.description || undefined,
            isMainImage: false,
          }));
      }

      // Handle videos
      if (videosResult.data) {
        // Create a Set to track unique video URLs
        const uniqueVideoUrls = new Set<string>();

        // Filter out duplicate videos and map to MediaItem format
        articleVideos = videosResult.data
          .filter((vid: { id: number; video_url: string }) => {
            // Skip if we've seen this URL before
            if (uniqueVideoUrls.has(vid.video_url)) {
              return false;
            }
            // Add URL to set and include the video
            uniqueVideoUrls.add(vid.video_url);
            return true;
          })
          .map((vid: { id: number; video_url: string }) => ({
            id: vid.id,
            url: vid.video_url,
          }));
      }

      // Update the additional media state with both unique images and videos
      setAdditionalMedia({
        images: articleImages,
        videos: articleVideos,
      });
    } catch (error) {
      console.error("Error fetching additional media:", error);
    }
  };

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
        await fetchAdditionalMedia(result.data.id, result.data.image);
      } catch (error) {
        console.error("Error fetching article:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch article"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleVideoClick = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    if (onBookmark) {
      onBookmark(articleId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] bg-gray-50 rounded-xl">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-8 rounded-xl shadow-sm border border-red-100">
        <p className="text-red-700 text-center">
          {error === "Article not found" ? (
            <>
              <h2 className="text-2xl font-bold mb-4">
                404 - Article Not Found
              </h2>
              <p className="text-gray-600">
                The article you're looking for doesn't exist or has been
                removed.
              </p>
            </>
          ) : (
            error
          )}
        </p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <p className="text-gray-500 text-lg">Article not found.</p>
      </div>
    );
  }

  return (
    <article className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-8">
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
        articleId={Number(article.id)}
      />
      <ArticleContent content={article.content} />
      <ArticleTags
        tags={
          article.tag_names?.map((name, index) => ({
            name,
            color: article.tag_colors?.[index] || "#6B7280", // Fallback to gray if no color
          })) || []
        }
      />
      <ArticleActions
        showBackButton={showBackButton}
        isBookmarked={isBookmarked}
        onBookmark={handleBookmark}
      />
    </article>
  );
}
