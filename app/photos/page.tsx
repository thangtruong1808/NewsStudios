import React from "react";
import { getImages } from "../lib/actions/images";
import PhotosClientNew from "../components/PhotosClientNew";
import { constructImageUrl } from "../lib/utils/imageUtils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PhotosPage() {
  console.log("Fetching images for photos page...");
  const result = await getImages();

  if (result.error) {
    console.error("Error fetching images:", result.error);
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
  console.log(`Found ${images.length} images`);

  // Log the first few images for debugging
  if (images.length > 0) {
    console.log(
      "First few images:",
      images.slice(0, 3).map((img) => ({
        id: img.id,
        url: img.image_url,
        constructedUrl: constructImageUrl(img.image_url),
      }))
    );
  }

  const hasImages = images.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Photo Gallery</h1>

      {!hasImages ? (
        <div className="mt-6 rounded-md bg-gray-50 p-6 text-center">
          <p className="text-gray-500">No photos found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image) => {
            // Get the final URL after constructImageUrl is applied
            const finalUrl = constructImageUrl(image.image_url);

            return (
              <div
                key={image.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <PhotosClientNew photos={[image]} />
                <div className="p-4">
                  {image.description && (
                    <p className="text-gray-700 mb-2">{image.description}</p>
                  )}
                  <p className="text-xs text-gray-500 break-all">
                    Original: {image.image_url}
                  </p>
                  <p className="text-xs text-blue-500 break-all mt-1">
                    Final URL: {finalUrl}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
