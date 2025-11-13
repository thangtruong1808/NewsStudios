"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from "@heroicons/react/24/outline";

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
  titles?: string[]; // Add titles array prop
  dates?: string[]; // Add dates array prop
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
  slideInterval = 5000, // Default 5 seconds between slides
  titles = [], // Add titles prop with default empty array
  dates = [], // Add dates prop with default empty array
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Function to handle next slide
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  // Function to handle previous slide
  const prevSlide = useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  }, [images.length]);

  // Auto-sliding effect
  useEffect(() => {
    if (!autoSlide) return;

    const interval = setInterval(() => {
      nextSlide();
    }, slideInterval);

    return () => clearInterval(interval);
  }, [autoSlide, slideInterval, nextSlide]);

  // Pause auto-sliding when hovering over the carousel
  useEffect(() => {
    if (!autoSlide || isHovered) return;

    const interval = setInterval(() => {
      nextSlide();
    }, slideInterval);

    return () => clearInterval(interval);
  }, [autoSlide, slideInterval, nextSlide, isHovered]);

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

  if (!images.length) return null;

  const currentImage = images[currentIndex];

  return (
    <div
      className={`relative w-full h-full bg-gray-100 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main image */}
      <div className="relative w-full h-full">
        <Image
          src={currentImage}
          alt={`${alt} ${currentIndex + 1}`}
          fill
          sizes="100vw"
          className="object-contain w-full h-full"
          priority={currentIndex === 0}
        />
        {/* Title Overlay */}
        {titles[currentIndex] && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
            {dates[currentIndex] && (
              <div className="flex items-center gap-1 text-gray-200 text-sm mb-1">
                <CalendarIcon className="h-4 w-4" />
                <span>{formatDate(dates[currentIndex])}</span>
              </div>
            )}
            <p className="text-white text-sm font-medium truncate">
              {titles[currentIndex]}
            </p>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
            aria-label="Next image"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Slide indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? "bg-white" : "bg-white/50"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
