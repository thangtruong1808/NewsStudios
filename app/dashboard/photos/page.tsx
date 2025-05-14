"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getImages, searchImages } from "@/app/lib/actions/images";
import { toast } from "react-hot-toast";
import PhotosHeader from "@/app/components/dashboard/photos/header";
import PhotosSearch from "@/app/components/dashboard/photos/search";
import PhotosGrid from "@/app/components/dashboard/shared/grid/PhotosGrid";
import { Image } from "@/app/lib/definition";

interface ImageRow {
  id: number;
  article_id: number | null;
  image_url: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
}

interface PaginatedResult {
  data: ImageRow[];
  error: string | null;
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

// Use static rendering by default, but revalidate every 60 seconds
export const revalidate = 60;

export default function PhotosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [photos, setPhotos] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);

  const convertImageRowToImage = (row: ImageRow): Image => ({
    ...row,
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
  });

  useEffect(() => {
    const fetchPhotos = async () => {
      setIsLoading(true);
      try {
        const result = searchQuery
          ? await searchImages(searchQuery)
          : await getImages(undefined, currentPage, itemsPerPage);

        if (result.error) {
          toast.error(result.error);
          return;
        }

        const paginatedResult = result as PaginatedResult;
        const convertedPhotos = paginatedResult.data.map(
          convertImageRowToImage
        );

        if (currentPage === 1) {
          setPhotos(convertedPhotos);
        } else {
          setPhotos((prev) => [...prev, ...convertedPhotos]);
        }

        setTotalItems(paginatedResult.pagination.totalItems);
        setHasMore(
          paginatedResult.pagination.totalItems > currentPage * itemsPerPage
        );
      } catch (error) {
        console.error("Error fetching photos:", error);
        toast.error("Failed to fetch photos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, [currentPage, itemsPerPage, searchQuery]);

  const handleSearch = (term: string) => {
    setSearchQuery(term);
    setCurrentPage(1);
    setPhotos([]);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
    setPhotos([]);
  };

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handleEdit = (photo: Image) => {
    router.push(`/dashboard/photos/${photo.id}/edit`);
  };

  const handleDelete = async (photo: Image) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/photos/${photo.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete photo");
      }

      toast.success("Photo deleted successfully");
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
      setTotalItems((prev) => prev - 1);
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast.error("Failed to delete photo");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <PhotosHeader />
      <PhotosSearch onSearch={handleSearch} />
      <div className="mt-4">
        <p className="text-sm text-gray-500 mb-4">Total Photos: {totalItems}</p>
        {photos.length === 0 && !isLoading ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-2">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No Photos Found
            </h3>
            <p className="text-gray-500">
              {searchQuery
                ? "No photos match your search criteria."
                : "It seems the photos are not available. They might have been accidentally deleted from the storage."}
            </p>
          </div>
        ) : (
          <PhotosGrid
            photos={photos}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        )}
        {hasMore && !isLoading && photos.length > 0 && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleLoadMore}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
