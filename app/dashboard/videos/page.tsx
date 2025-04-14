import React from "react";
import Link from "next/link";
import { SearchWrapper } from "../../components/dashboard/search";
import { lusitana } from "../../components/fonts";
import { PlusIcon } from "@heroicons/react/24/outline";
import { VideosTableClient } from "../../components/dashboard/videos/VideosTableClient";
import { getVideos } from "../../lib/actions/videos";
import { Video } from "../../lib/definition";

export default async function VideosPage() {
  const result = await getVideos();

  // Handle error case
  if (result.error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading videos
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{result.error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle empty data case
  const videos = Array.isArray(result.data) ? result.data : [];
  const hasVideos = videos.length > 0;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Videos</h1>
        <Link
          href="/dashboard/videos/create"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
        >
          <PlusIcon className="h-5 w-5" />
          Add Video
        </Link>
      </div>
      <div className="mt-4">
        <SearchWrapper placeholder="Search videos" />
        {hasVideos ? (
          <VideosTableClient videos={videos as Video[]} />
        ) : (
          <div className="mt-6 rounded-md bg-gray-50 p-6 text-center">
            <p className="text-gray-500">
              No videos found. Create your first video to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
