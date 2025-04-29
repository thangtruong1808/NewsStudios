import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { getImages } from "../../lib/actions/images";
import { getArticles } from "../../lib/actions/articles";
import { Article } from "../../lib/definition";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PhotosPage() {
  const result = await getImages();
  const articlesResult = await getArticles();
  const articles = Array.isArray(articlesResult) ? articlesResult : [];

  if (result.error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading images
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{result.error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const images = result.data || [];
  const hasImages = images.length > 0;

  // Create a map of article IDs to titles for quick lookup
  const articleMap = new Map();
  articles.forEach((article: Article) => {
    articleMap.set(article.id, article.title);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Photos</h1>
        <Link
          href="/dashboard/photos/create"
          className="flex h-10 items-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          <span className="hidden md:block">Add Photo</span>{" "}
          <PlusIcon className="h-5 md:ml-4" />
        </Link>
      </div>

      {!hasImages ? (
        <div className="mt-6 rounded-md bg-gray-50 p-6 text-center">
          <p className="text-gray-500">
            No photos found. Add your first photo to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image) => {
            if (!image.image_url) {
              console.warn(`Image with ID ${image.id} has no URL, skipping`);
              return null;
            }

            // Check if the image URL is from the newshub_photos folder
            const isNewshubPhoto = image.image_url.includes("newshub_photos");

            // Format the updated_at date
            const updatedDate = image.updated_at
              ? new Date(image.updated_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "N/A";

            // Get article title if article_id exists
            const articleTitle =
              image.article_id && articleMap.has(image.article_id)
                ? articleMap.get(image.article_id)
                : null;

            return (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl"
              >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={
                      isNewshubPhoto ? image.image_url : "/image-not-found.jpeg"
                    }
                    alt={image.description || `Image ${image.id}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    priority={false}
                    quality={85}
                  />
                </div>

                {/* Overlay with actions - visible on hover */}
                <div className="absolute inset-0 flex flex-col justify-between bg-black bg-opacity-0 p-4 transition-all duration-300 group-hover:bg-opacity-50">
                  {/* Top actions */}
                  <div className="flex justify-end space-x-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <button
                      className="rounded-full bg-white p-2 text-gray-700 shadow-md transition-colors hover:bg-gray-100"
                      aria-label="Edit image"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      className="rounded-full bg-white p-2 text-gray-700 shadow-md transition-colors hover:bg-gray-100"
                      aria-label="Delete image"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Image Details - Always visible below the image */}
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-indigo-600">
                      ID: {image.id}
                    </span>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        Updated: {updatedDate}
                      </span>
                    </div>
                  </div>

                  {image.article_id && (
                    <div className="text-sm">
                      <span className="text-xs font-medium text-indigo-600">
                        Article Title:{" "}
                      </span>
                      <span className="text-xs text-gray-500">
                        {articleTitle
                          ? articleTitle
                          : `ID: ${image.article_id}`}
                      </span>
                    </div>
                  )}

                  {image.description && (
                    <div className="text-sm">
                      <span className="text-xs font-medium text-indigo-600">
                        Description:{" "}
                      </span>
                      <span className="text-xs text-gray-500">
                        {image.description}
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
