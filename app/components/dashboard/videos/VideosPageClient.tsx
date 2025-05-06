"use client";

import React, { useState } from "react";
import { Video } from "@/app/lib/definition";
import { SearchWrapper } from "../search";
import { formatDateToLocal } from "@/app/lib/utils";
import Link from "next/link";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface VideosPageClientProps {
  videos: Video[];
  articles: { id: number; title: string }[];
}

export default function VideosPageClient({
  videos,
  articles,
}: VideosPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Create a map of article IDs to titles for quick lookup
  const articleMap = new Map();
  articles.forEach((article) => {
    articleMap.set(article.id, article.title);
  });

  // Filter videos based on search query
  const filteredVideos = videos.filter((video) =>
    Object.values(video).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVideos = filteredVideos.slice(startIndex, endIndex);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="mb-4">
            <SearchWrapper
              placeholder="Search videos..."
              onSearch={setSearchQuery}
            />
          </div>
          <div className="md:hidden">
            {currentVideos.map((video) => (
              <div
                key={video.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{articleMap.get(video.article_id) || "No article"}</p>
                    </div>
                    <p className="text-sm text-gray-500">{video.video_url}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      {formatDateToLocal(video.updated_at)}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/dashboard/videos/${video.id}/edit`}
                      className="rounded-md border p-2 hover:bg-gray-100"
                    >
                      <PencilIcon className="w-5" />
                    </Link>
                    <button className="rounded-md border p-2 hover:bg-gray-100">
                      <TrashIcon className="w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Article ID
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Article
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Video URL
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Description
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Updated
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {currentVideos.map((video) => (
                <tr
                  key={video.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{video.article_id || "N/A"}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <p>{articleMap.get(video.article_id) || "No article"}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <a
                      href={video.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {video.video_url}
                    </a>
                  </td>
                  <td className="px-3 py-3">
                    <p className="max-w-xs truncate">
                      {video.description || "No description"}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(video.updated_at)}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/dashboard/videos/${video.id}/edit`}
                        className="rounded-md border p-2 hover:bg-gray-100"
                      >
                        <PencilIcon className="w-5" />
                      </Link>
                      <button className="rounded-md border p-2 hover:bg-gray-100">
                        <TrashIcon className="w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-5 flex w-full justify-center">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-md border p-2 hover:bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="rounded-md border p-2 hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
