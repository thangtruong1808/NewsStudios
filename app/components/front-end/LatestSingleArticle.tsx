"use client";

import { useState, useEffect } from "react";
import { getArticles } from "@/app/lib/actions/articles";
import { getImages } from "@/app/lib/actions/images";
import { getVideos } from "@/app/lib/actions/videos";
import { Article } from "@/app/lib/definition";
import Link from "next/link";
import { ArticleHeader } from "./latest-articles/ArticleHeader";
import { ArticleMetadata } from "./latest-articles/ArticleMetadata";
import { ArticleInfo } from "./latest-articles/ArticleInfo";
import { AdditionalMediaSection } from "./latest-articles/AdditionalMediaSection";
import { MainMediaDisplay } from "./latest-articles/MainMediaDisplay";
import { VideoModal } from "./latest-articles/VideoModal";
import { AdditionalMedia, MediaItem } from "./latest-articles/types";
import { ClockIcon } from "@heroicons/react/24/solid";
import { LatestSingleArticleSkeleton } from "./latest-articles/LatestSingleArticleSkeleton";

export default function LatestSingleArticle() {
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      console.log("Fetching media for article:", {
        articleId,
        mainImage,
      });

      // Fetch both images and videos for the specific article
      const [imagesResult, videosResult] = await Promise.all([
        getImages(articleId),
        getVideos(articleId),
      ]);

      let articleImages: MediaItem[] = [];

      // Handle images
      if (imagesResult.data) {
        console.log("Raw images from DB:", imagesResult.data);

        // Include all images, including the main image
        articleImages = imagesResult.data.map((img) => ({
          id: img.id,
          url: img.image_url,
          description: img.description || undefined,
          isMainImage: img.image_url === mainImage,
        }));

        console.log("Processed images:", {
          total: imagesResult.data.length,
          mainImage,
          images: articleImages.map((img) => ({
            id: img.id,
            url: img.url,
            isMainImage: img.isMainImage,
          })),
        });

        setAdditionalMedia((prev) => ({ ...prev, images: articleImages }));
      }

      // Handle videos
      if (videosResult.data) {
        const articleVideos = videosResult.data.map((vid) => ({
          id: vid.id,
          url: vid.video_url,
        }));

        setAdditionalMedia((prev) => ({ ...prev, videos: articleVideos }));
      }

      console.log("Final Additional Media State:", {
        images: imagesResult.data?.length || 0,
        videos: videosResult.data?.length || 0,
        additionalImages: articleImages.length,
      });
    } catch (error) {
      console.error("Error fetching additional media:", error);
    }
  };

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
          await fetchAdditionalMedia(latestArticle.id, latestArticle.image);
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

  // Add effect to update additional media when article changes
  useEffect(() => {
    if (article) {
      // Only fetch if we have both article ID and image
      if (article.id && article.image !== undefined) {
        fetchAdditionalMedia(article.id, article.image || null);
      }
    }
  }, [article?.id, article?.image]);

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
    return <LatestSingleArticleSkeleton />;
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
        <div className="flex items-center gap-2 mb-4">
          <ArticleHeader title={article.title} />
          {/* <span className="inline-flex items-center px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
            <ClockIcon className="h-5 w-5 mr-1.5" />
            Latest
          </span> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Media Content - Now first on mobile */}
          <div className="space-y-4 order-1">
            <MainMediaDisplay selectedImage={selectedImage} article={article} />
            <AdditionalMediaSection
              media={additionalMedia}
              onImageClick={handleImageClick}
              onVideoClick={handleVideoClick}
            />
          </div>

          {/* Text Content - Now second on mobile */}
          <div className="space-y-4 order-2">
            <p className="text-gray-600 line-clamp-4">{article.content}</p>
            <ArticleMetadata article={article} />
            <ArticleInfo article={article} />
          </div>
        </div>
      </Link>

      <VideoModal videoUrl={selectedVideo} onClose={closeVideoModal} />
    </div>
  );
}
