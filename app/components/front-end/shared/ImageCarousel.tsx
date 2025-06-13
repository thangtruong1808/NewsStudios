"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export interface CarouselItem {
  id: string | number;
  title: string;
  description?: string;
  image: string;
  link?: string;
}

// Props interface for the ImageCarousel component
interface ImageCarouselProps {
  images: string[]; // Array of image URLs
  alt?: string; // Alt text for images
  className?: string; // Optional additional CSS classes
  autoSlide?: boolean; // Enable/disable auto-sliding
  slideInterval?: number; // Time between slides in milliseconds
}

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
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

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
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!autoSlide || isHovered) return;

    const interval = setInterval(() => {
      nextSlide();
    }, slideInterval);

    return () => clearInterval(interval);
  }, [autoSlide, slideInterval, nextSlide, isHovered]);

  if (!images.length) return null;

  const currentImage = images[currentIndex];

  return (
    <div
      className={`relative w-full h-full ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main image */}
      <div className="relative w-full h-full">
        <Image
          src={currentImage}
          alt={`${alt} ${currentIndex + 1}`}
          fill
          className="object-cover"
          priority={currentIndex === 0}
        />
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
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-white" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
