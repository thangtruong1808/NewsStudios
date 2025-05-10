import React from "react";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
import { getImages } from "../../lib/actions/images";
import { getArticles } from "../../lib/actions/articles";
import PhotosGridClient from "../../components/dashboard/photos/PhotosGridClient";
import { Article } from "@/app/lib/definition";

// Use static rendering by default, but revalidate every 60 seconds
export const revalidate = 60;

interface PageProps {
  searchParams?: {
    page?: string;
  };
}

interface ApiResponse<T> {
  data?: T[];
  error?: string;
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

export default async function PhotosPage({ searchParams }: PageProps) {
  const currentPage = Number(searchParams?.page) || 1;
  const itemsPerPage = 12;

  // Fetch images and articles
  const [imagesResult, articlesResult] = (await Promise.all([
    getImages(undefined, currentPage, itemsPerPage),
    getArticles(),
  ])) as [ApiResponse<any>, ApiResponse<Article>];

  // Debug logs
  console.log("Images Result:", {
    totalItems: imagesResult.pagination?.totalItems,
    currentPage: imagesResult.pagination?.currentPage,
    totalPages: imagesResult.pagination?.totalPages,
    itemsPerPage: imagesResult.pagination?.itemsPerPage,
    imagesCount: imagesResult.data?.length,
  });

  // Handle errors
  if (imagesResult.error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading images
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{imagesResult.error}</p>
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

  // Create a map of article IDs to titles for quick lookup
  const articleMap = new Map(
    articlesResult.data?.map((article: Article) => [
      article.id,
      article.title,
    ]) || []
  );

  // Get the images data
  const images = imagesResult.data || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Photos</h1>
        <Link
          href="/dashboard/photos/create"
          className="inline-flex items-center gap-1 rounded-md border border-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:from-violet-700 hover:to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Add Photo</span>
        </Link>
      </div>

      {images.length > 0 ? (
        <PhotosGridClient
          images={images}
          articleMap={articleMap}
          initialPage={currentPage}
          totalItems={imagesResult.pagination?.totalItems || 0}
        />
      ) : (
        <div className="mt-6 rounded-md bg-gray-50 p-6 text-center">
          <p className="text-gray-500">
            No photos found. Add your first photo to get started.
          </p>
        </div>
      )}
    </div>
  );
}
