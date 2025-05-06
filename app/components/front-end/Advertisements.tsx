"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Advertisement } from "@/app/lib/definition";
import { getAdvertisements } from "@/app/lib/actions/advertisements";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function Advertisements() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        const result = await getAdvertisements();
        if (result.error) {
          throw new Error(result.error);
        }
        if (result.data) {
          setAdvertisements(result.data);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch advertisements"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdvertisements();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === advertisements.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? advertisements.length - 1 : prevIndex - 1
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (advertisements.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          No advertisements available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="relative bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Carousel Container */}
          <div className="relative h-[400px] overflow-hidden rounded-lg">
            {advertisements.map((ad, index) => (
              <div
                key={ad.id}
                className={`absolute w-full h-full transition-transform duration-500 ease-in-out ${
                  index === currentIndex
                    ? "translate-x-0"
                    : index < currentIndex
                    ? "-translate-x-full"
                    : "translate-x-full"
                }`}
              >
                <div className="h-full bg-white rounded-lg shadow-lg overflow-hidden">
                  {ad.ad_type === "banner" && ad.image_url && (
                    <div className="relative h-64 w-full">
                      <Image
                        src={ad.image_url}
                        alt={ad.ad_content}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  {ad.ad_type === "video" && ad.video_url && (
                    <div className="relative h-64 w-full">
                      {ad.video_url.includes("youtube") ? (
                        <iframe
                          src={ad.video_url.replace("watch?v=", "embed/")}
                          className="absolute inset-0 w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <video
                          controls
                          className="absolute inset-0 w-full h-full object-cover"
                        >
                          <source src={ad.video_url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>
                  )}
                  <div className="p-4">
                    <p className="text-gray-600 text-sm">{ad.ad_content}</p>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>
                          {new Date(ad.start_date).toLocaleDateString()} -{" "}
                          {new Date(ad.end_date).toLocaleDateString()}
                        </span>
                        {ad.sponsor_id && (
                          <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                            {ad.sponsor_name || `Sponsor ID: ${ad.sponsor_id}`}
                          </span>
                        )}
                      </div>
                      {ad.article_title && (
                        <p className="text-xs text-gray-500">
                          Article: {ad.article_title}
                        </p>
                      )}
                      {ad.category_name && (
                        <p className="text-xs text-gray-500">
                          Category: {ad.category_name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
          >
            <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
          >
            <ChevronRightIcon className="h-6 w-6 text-gray-600" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {advertisements.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex ? "bg-indigo-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
