import React from "react";
import Link from "next/link";
import { PlusIcon, ClockIcon } from "@heroicons/react/24/outline";
import { getVideos } from "@/app/lib/actions/videos";
import { getArticles } from "@/app/lib/actions/articles";
import VideosPageClient from "@/app/components/dashboard/videos/VideosPageClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function VideosPage() {
  const videosResult = await getVideos();
  const articlesResult = await getArticles();
  const articles = Array.isArray(articlesResult) ? articlesResult : [];

  if (videosResult.error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading videos
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{videosResult.error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const videos = videosResult.data || [];
  const hasVideos = videos.length > 0;

  // Create a map of article IDs to titles for quick lookup
  const articleMap = new Map();
  articles.forEach((article) => {
    articleMap.set(article.id, article.title);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Videos</h1>
        <Link
          href="/dashboard/videos/create"
          className="flex h-10 items-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          <span className="hidden md:block">Add Video</span>{" "}
          <PlusIcon className="h-5 md:ml-4" />
        </Link>
      </div>

      {!hasVideos ? (
        <div className="mt-6 rounded-md bg-gray-50 p-6 text-center">
          <p className="text-gray-500">
            No videos found. Add your first video to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.map((video) => {
            if (!video.video_url) {
              console.warn(`Video with ID ${video.id} has no URL, skipping`);
              return null;
            }

            // Format the updated_at date
            const updatedDate = video.updated_at
              ? new Date(video.updated_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "N/A";

            // Get article title if article_id exists
            const articleTitle =
              video.article_id && articleMap.has(video.article_id)
                ? articleMap.get(video.article_id)
                : null;

            return (
              <div
                key={video.id}
                className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl"
              >
                {/* Video Container */}
                <div className="relative aspect-video overflow-hidden">
                  <video
                    src={video.video_url}
                    className="w-full h-full object-cover"
                    controls
                  />
                </div>

                {/* Video Details - Always visible below the video */}
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-indigo-600">
                      ID: {video.id}
                    </span>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        Updated: {updatedDate}
                      </span>
                    </div>
                  </div>

                  {video.article_id && (
                    <div className="text-sm">
                      <span className="text-xs font-medium text-indigo-600">
                        Article Title:{" "}
                      </span>
                      <span className="text-xs text-gray-500">
                        {articleTitle
                          ? articleTitle
                          : `ID: ${video.article_id}`}
                      </span>
                    </div>
                  )}

                  {video.description && (
                    <div className="text-sm">
                      <span className="text-xs font-medium text-indigo-600">
                        Description:{" "}
                      </span>
                      <span className="text-xs text-gray-500">
                        {video.description}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
