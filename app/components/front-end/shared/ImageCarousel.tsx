"use client";

// Component Info
// Description: Enhanced image carousel component with smooth transitions, keyboard navigation, improved styling, and better UX.
// Date created: 2025-01-27
// Author: thangtruong

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, PhotoIcon } from "@heroicons/react/24/outline";

export interface CarouselItem {
  id: string | number;
  title: string;
  description?: string;
  image: string;
  link?: string;
  date?: string;
}

// Props interface for the ImageCarousel component
/* eslint-disable no-unused-vars */
interface ImageCarouselProps {
  images: string[]; // Array of image URLs
  alt?: string; // Alt text for images
  className?: string; // Optional additional CSS classes
  autoSlide?: boolean; // Enable/disable auto-sliding
  slideInterval?: number; // Time between slides in milliseconds
  titles?: string[]; // Article titles array
  dates?: string[]; // Article dates array
  articleIds?: number[]; // Article IDs for clickable links
}
/* eslint-enable no-unused-vars */

/**
 * ImageCarousel component for displaying images in a carousel/slider
 * - Supports manual navigation with arrow buttons
 * - Optional auto-sliding functionality
 * - Responsive design with full-width images
 * - Smooth transitions between slides
 */
export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  alt = "Carousel image",
  className = "",
  autoSlide = true,
  slideInterval = 5000,
  titles = [],
  dates = [],
  articleIds = [],
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Filter out empty images
  const validImages = images.filter((img) => img && img.trim() !== "");

  // Navigate to slide with transition guard
  const goToSlide = useCallback((newIndex: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(newIndex);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((currentIndex + 1) % validImages.length);
  }, [currentIndex, validImages.length, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentIndex - 1 + validImages.length) % validImages.length);
  }, [currentIndex, validImages.length, goToSlide]);

  // Handle keyboard navigation when carousel is focused
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isFocused = carouselRef.current?.contains(document.activeElement) || 
                        document.activeElement === carouselRef.current;
      if (!isFocused) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        prevSlide();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        nextSlide();
      }
    };

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("keydown", handleKeyDown);
      return () => carousel.removeEventListener("keydown", handleKeyDown);
    }
  }, [nextSlide, prevSlide]);

  // Auto-sliding effect (pauses on hover)
  useEffect(() => {
    if (!autoSlide || isHovered || validImages.length <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, slideInterval);

    return () => clearInterval(interval);
  }, [autoSlide, slideInterval, nextSlide, isHovered, validImages.length]);

  // Format date function
  const formatDate = (dateString: string) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "";
      }

      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      };

      return date.toLocaleDateString("en-US", options);
    } catch (_error) {
      return "";
    }
  };

  if (!validImages.length) {
    // Placeholder when no images available - friendly message
    return (
      <div className={`relative w-full h-full bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 ${className}`}>
        <div className="w-full h-full flex flex-col items-center justify-center">
          <PhotoIcon className="h-16 w-16 text-gray-400 mb-3" />
          <span className="text-sm text-gray-500 font-medium">Images coming soon</span>
        </div>
      </div>
    );
  }

  const currentImage = validImages[currentIndex];
  const currentArticleId = articleIds[currentIndex];
  const hasLink = currentArticleId !== undefined;
  
  // Image content wrapper
  const imageContent = (
    <div className="relative w-full h-full overflow-hidden">
      {currentImage ? (
        <div className="relative w-full h-full">
          <Image
            src={currentImage}
            alt={titles[currentIndex] || `${alt} ${currentIndex + 1}`}
            fill
            sizes="100vw"
            className="object-cover w-full h-full transition-opacity duration-300"
            priority={currentIndex === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200">
          <PhotoIcon className="h-16 w-16 text-gray-400 mb-3" />
          <span className="text-sm text-gray-500 font-medium">Image coming soon</span>
        </div>
      )}
      {/* Title overlay */}
      {titles[currentIndex] && (
        <div className="absolute bottom-0 left-0 right-0 p-6 pb-8">
          {dates[currentIndex] && (
            <div className="flex items-center gap-2 text-white/90 text-sm mb-2">
              <CalendarIcon className="h-4 w-4" />
              <span>{formatDate(dates[currentIndex])}</span>
            </div>
          )}
          <h3 className={`text-white font-bold ${hasLink ? "group-hover:text-blue-300 transition-colors" : ""}`}>
            <span className="line-clamp-2 text-lg md:text-xl">{titles[currentIndex]}</span>
          </h3>
        </div>
      )}
    </div>
  );

  return (
    <div
      ref={carouselRef}
      className={`relative w-full h-full bg-gray-100 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={0}
      role="region"
      aria-label="Image carousel"
    >
      {/* Main image container */}
      {hasLink ? (
        <Link href={`/articles/${currentArticleId}`} className="block w-full h-full group cursor-pointer">
          {imageContent}
        </Link>
      ) : (
        <div className="w-full h-full">{imageContent}</div>
      )}

      {/* Enhanced navigation buttons */}
      {validImages.length > 1 && (
        <>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); prevSlide(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-900 p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 z-10 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); nextSlide(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-900 p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 z-10 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Next image"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Enhanced slide indicators */}
      {validImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {validImages.map((_, index) => (
            <button
              key={index}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); goToSlide(index); }}
              className={`transition-all duration-200 rounded-full ${
                index === currentIndex ? "w-8 h-2 bg-white shadow-md" : "w-2 h-2 bg-white/60 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
