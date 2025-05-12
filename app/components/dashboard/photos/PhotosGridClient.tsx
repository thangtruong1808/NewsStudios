"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ClockIcon, PencilIcon } from "@heroicons/react/24/outline";
import DeleteButton from "../../../dashboard/photos/DeleteButton";
import Pagination from "../users/Pagination";
import { useRouter, useSearchParams } from "next/navigation";

interface Image {
  id: number;
  article_id: number | null;
  image_url: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
  article_title?: string;
}

interface PhotosGridClientProps {
  images: Image[];
  articleMap: Map<number, string>;
  initialPage: number;
  totalItems: number;
  searchQuery?: string;
}

export default function PhotosGridClient({
  images,
  articleMap,
  initialPage,
  totalItems,
  searchQuery = "",
}: PhotosGridClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(initialPage);
  const itemsPerPage = 12; // Show 12 photos per page (2 rows of 6)
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Debug logs
  console.log("PhotosGridClient Props:", {
    imagesCount: images.length,
    totalItems,
    initialPage,
    currentPage,
    totalPages,
    searchQuery,
  });

  // Update current page when URL changes
  useEffect(() => {
    const page = Number(searchParams.get("page")) || 1;
    setCurrentPage(page);
  }, [searchParams]);

  // Handle image deletion
  const handleImageDelete = (deletedImageId: number) => {
    // If the current page becomes empty after deletion, go to the previous page
    if (images.length === 1 && currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      const params = new URLSearchParams(searchParams);
      params.set("page", newPage.toString());
      if (searchQuery) {
        params.set("query", searchQuery);
      }
      router.push(`/dashboard/photos?${params.toString()}`);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    if (searchQuery) {
      params.set("query", searchQuery);
    }
    router.push(`/dashboard/photos?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {images.map((image) => {
          if (!image.image_url) {
            console.warn(`Image with ID ${image.id} has no URL, skipping`);
            return null;
          }

          // Check if the image URL is from Cloudinary
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

          // // Debug logs for article title
          // console.log("Article Title Debug:", {
          //   imageId: image.id,
          //   articleId: image.article_id,
          //   articleTitle,
          //   hasInMap: image.article_id
          //     ? articleMap.has(image.article_id)
          //     : false,
          //   mapValue: image.article_id
          //     ? articleMap.get(image.article_id)
          //     : null,
          //   articleMapSize: articleMap.size,
          //   articleMapEntries: Array.from(articleMap.entries()),
          // });

          return (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl"
            >
              {/* Image Container */}
              <div className="relative w-full h-[150px] overflow-hidden">
                {isNewshubPhoto ? (
                  <Image
                    src={image.image_url}
                    alt={image.description || `Image ${image.id}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    priority={false}
                    quality={85}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                    <div className="text-center p-4">
                      <p className="text-sm font-medium">
                        Image Not Available on Server
                      </p>
                      <p className="text-xs mt-1">ID: {image.id}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Image Details - Always visible below the image */}
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-indigo-600">
                    Article ID: {image.article_id || "Not assigned"}
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
                    <span className="text-xs text-gray-500 line-clamp-1">
                      {articleTitle}
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

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
                  <Link
                    href={`/dashboard/photos/${image.id}/edit`}
                    className="inline-flex items-center gap-1 rounded border border-blue-500 px-2.5 py-1.5 text-xs font-medium text-blue-500 hover:bg-blue-100 min-w-[70px] justify-center"
                  >
                    <PencilIcon className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </Link>
                  <DeleteButton imageId={image.id} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalItems > 0 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
