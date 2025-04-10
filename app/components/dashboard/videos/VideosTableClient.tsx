"use client";

import React, { useState, useEffect } from "react";
import { Video } from "../../../login/login-definitions";
import { TableHeader } from "./TableHeader";
import { TableBody } from "./TableBody";
import { Pagination } from "./Pagination";
import { Search } from "../../search/Search";

interface VideosTableClientProps {
  videos: Video[];
}

export function VideosTableClient({ videos }: VideosTableClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVideos, setFilteredVideos] = useState(videos);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Video>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const itemsPerPage = 10;

  useEffect(() => {
    const filtered = videos.filter((video) =>
      Object.values(video).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setFilteredVideos(filtered);
    setCurrentPage(1);
  }, [searchQuery, videos]);

  const handleSort = (field: keyof Video) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedVideos = [...filteredVideos].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    // Handle null values
    if (aValue === null) return 1;
    if (bValue === null) return -1;

    // Handle undefined values
    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;

    // Compare values
    if (aValue === bValue) return 0;
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    return sortDirection === "asc" ? 1 : -1;
  });

  const totalPages = Math.ceil(sortedVideos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVideos = sortedVideos.slice(startIndex, endIndex);

  const handleDelete = (id: number) => {
    // Implement delete functionality
    console.log("Delete video with ID:", id);
  };

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="mb-4">
            <Search
              placeholder="Search videos..."
              value={searchQuery}
              onChange={setSearchQuery}
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
                      <p>{video.article_title}</p>
                    </div>
                    <p className="text-sm text-gray-500">{video.video_url}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <TableHeader
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <TableBody videos={currentVideos} onDelete={handleDelete} />
          </table>
        </div>
      </div>
      <div className="mt-5 flex w-full justify-center">
        <Pagination
          totalItems={filteredVideos.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
