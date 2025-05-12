import React from "react";
import Link from "next/link";
import {
  PlusIcon,
  ClockIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { getVideos, searchVideos } from "@/app/lib/actions/videos";
import { getArticles } from "@/app/lib/actions/articles";
import { deleteVideo } from "@/app/lib/actions/videos";
import { toast } from "react-hot-toast";
import DeleteVideoButton from "@/app/components/dashboard/videos/DeleteVideoButton";
import VideosGridClient from "@/app/components/dashboard/videos/VideosGridClient";
import VideosSearchWrapper from "@/app/components/dashboard/videos/VideosSearchWrapper";
import { Article } from "@/app/lib/definition";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ApiResponse<T> {
  data: T[] | null;
  error: string | null;
}

interface PageProps {
  searchParams?: {
    query?: string;
    page?: string;
  };
}

export default async function VideosPage({ searchParams }: PageProps) {
  const searchQuery = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  // Use searchVideos if there's a search query, otherwise use getVideos
  const [videosResult, articlesResult] = await Promise.all([
    searchQuery ? searchVideos(searchQuery) : getVideos(),
    getArticles(),
  ]);

  // Handle errors
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

  if (articlesResult.error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading articles
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{articlesResult.error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const videos = videosResult.data || [];
  const hasVideos = videos.length > 0;

  // Create a map of article IDs to titles for quick lookup
  const articleMap = new Map(
    (articlesResult.data || []).map((article: Article) => [
      article.id,
      article.title,
    ])
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Videos List</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your video content and their associations with articles
          </p>
        </div>
        <Link
          href="/dashboard/videos/create"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:from-violet-700 hover:to-fuchsia-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 justify-center items-center"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Video</span>
        </Link>
      </div>

      <div className="mb-6">
        <VideosSearchWrapper />
      </div>

      {hasVideos ? (
        <VideosGridClient
          videos={videos}
          articleMap={articleMap}
          searchQuery={searchQuery}
        />
      ) : (
        <div className="mt-6 rounded-md bg-gray-50 p-6 text-center">
          <p className="text-gray-500">
            {searchQuery
              ? "No videos found matching your search criteria."
              : "No videos found. Add your first video to get started."}
          </p>
        </div>
      )}
    </div>
  );
}
