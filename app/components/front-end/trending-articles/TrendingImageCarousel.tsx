"use client";

import { useState, useCallback } from "react";
import { Article } from "@/app/lib/definition";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface TrendingImageCarouselProps {
  articles: Article[];
}

export const TrendingImageCarousel = ({
  articles,
}: TrendingImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === articles.length - 1 ? 0 : prevIndex + 1
    );
  }, [articles.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? articles.length - 1 : prevIndex - 1
    );
  }, [articles.length]);

  if (articles.length === 0) return null;

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
      <div className="relative h-full w-full">
        <Link
          href={`/articles/${articles[currentIndex].id}`}
          className="block h-full w-full"
        >
          <Image
            src={
              articles[currentIndex].headline_image_url ||
              articles[currentIndex].image ||
              "/images/placeholder.jpg"
            }
            alt={articles[currentIndex].title}
            fill
            className="object-cover transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                {articles[currentIndex].title}
              </h3>
              <p className="text-gray-200 line-clamp-2">
                {articles[currentIndex].content}
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRightIcon className="h-6 w-6 text-gray-700" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {articles.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentIndex === index ? "bg-white w-4" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
