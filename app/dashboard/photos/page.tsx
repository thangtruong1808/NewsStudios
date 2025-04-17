import React from "react";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
import { getImages } from "../../lib/actions/images";
import SimpleImage from "../../components/SimpleImage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PhotosPage() {
  const result = await getImages();

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => {
            if (!image.image_url) {
              console.warn(`Image with ID ${image.id} has no URL, skipping`);
              return null;
            }

            // Determine if the image_url is a full URL or just a filename
            let imageUrl = image.image_url;

            // If it's not a full URL (doesn't start with http/https), construct the full URL
            if (
              !image.image_url.startsWith("http://") &&
              !image.image_url.startsWith("https://")
            ) {
              imageUrl = `https://srv876-files.hstgr.io/3fd7426401e9c4d8/files/public_html/Images/${image.image_url}`;
            }

            console.log(`Processing image ${image.id} with URL:`, imageUrl);

            return (
              <div key={image.id} className="relative aspect-square">
                <SimpleImage
                  src={imageUrl}
                  alt={`Image ${image.id}`}
                  width={500}
                  height={300}
                  className="shadow-lg w-full h-full object-cover"
                  useProxy={false}
                  useIframe={true}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                  {image.description && (
                    <div className="mb-1">{image.description}</div>
                  )}
                  <div className="text-xs text-gray-300 break-all">
                    {imageUrl || "No URL available"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
