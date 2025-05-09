"use client";

import { useState, useEffect } from "react";
import { getArticleById } from "@/app/lib/actions/articles";
import { getImages } from "@/app/lib/actions/images";
import { getVideos } from "@/app/lib/actions/videos";
import { Article } from "@/app/lib/definition";
import { LoadingSpinner } from "../../shared/LoadingSpinner";
import {
  CalendarIcon,
  UserIcon,
  TagIcon,
  FolderIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import { AdditionalMediaSection } from "../latest-articles/AdditionalMediaSection";
import { VideoModal } from "../latest-articles/VideoModal";
import { AdditionalMedia, MediaItem } from "../latest-articles/types";

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
        getImages(articleId),
        getVideos(articleId),
      ]);

      let articleImages: MediaItem[] = [];

      // Handle images
      if (imagesResult.data) {
        // Include all images, including the main image
        articleImages = imagesResult.data.map((img) => ({
          id: img.id,
          url: img.image_url,
          description: img.description || undefined,
          isMainImage: img.image_url === mainImage,
        }));

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
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
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
      <div className="text-center py-8">
        <p className="text-gray-500">Article not found.</p>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto">
      {/* Article Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {article.title}
        </h1>

        {/* Article Metadata */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            <span>
              {article.published_at
                ? new Date(article.published_at).toLocaleDateString()
                : "No date"}
            </span>
          </div>

          {article.author_name && (
            <div className="flex items-center gap-1">
              <UserIcon className="h-4 w-4" />
              <span>{article.author_name}</span>
            </div>
          )}

          {article.category_name && (
            <Link
              href={`/explore?category=${article.category_name}`}
              className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
            >
              <FolderIcon className="h-4 w-4" />
              <span>{article.category_name}</span>
            </Link>
          )}
        </div>

        {/* Media Section with Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Main Image Column */}
          <div className="md:col-span-2">
            {selectedImage && (
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <Image
                  src={selectedImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </div>

          {/* Additional Media Column */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Media Gallery
              </h3>
              <div className="max-h-[400px] overflow-y-auto">
                <AdditionalMediaSection
                  media={additionalMedia}
                  onImageClick={handleImageClick}
                  onVideoClick={handleVideoClick}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>

      {/* Article Tags */}
      {article.tag_names && article.tag_names.length > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TagIcon className="h-5 w-5" />
            Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {article.tag_names.map((tag) => (
              <Link
                key={tag}
                href={`/explore?tag=${encodeURIComponent(tag)}`}
                className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Article Actions */}
      <div className="border-t border-gray-200 pt-6 mt-8">
        <div className="flex items-center justify-between">
          {showBackButton && (
            <Link
              href="/explore"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              ← Back to Explore
            </Link>
          )}
          <button
            onClick={handleBookmark}
            className={`inline-flex items-center gap-2 ${
              isBookmarked
                ? "text-indigo-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
            aria-label="Bookmark article"
          >
            <BookmarkIcon className="h-5 w-5" />
            <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
          </button>
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal videoUrl={selectedVideo} onClose={closeVideoModal} />
      )}
    </article>
  );
}
