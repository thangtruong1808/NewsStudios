"use client";

export default function VideoCarouselSkeleton() {
  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-lg bg-gray-100">
      <div className="relative h-full w-full">
        {/* Main Video Skeleton */}
        <div className="relative h-full w-full bg-gray-200 animate-pulse">
          {/* Title Overlay Skeleton */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-300 to-transparent p-4">
            <div className="h-6 w-3/4 bg-gray-300 rounded animate-pulse mb-2" />
            <div className="h-4 w-1/2 bg-gray-300 rounded animate-pulse" />
          </div>
        </div>

        {/* Navigation Buttons Skeleton */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse" />
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse" />
        </div>

        {/* Auto-play Toggle Skeleton */}
        <div className="absolute top-4 right-4">
          <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse" />
        </div>

        {/* Thumbnails Strip Skeleton */}
        <div className="absolute bottom-16 left-0 right-0 bg-gray-200/30 p-2">
          <div className="flex space-x-2 overflow-x-auto">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="relative">
                <div className="relative aspect-video w-24 overflow-hidden rounded-lg bg-gray-300 animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Video Counter Skeleton */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-gray-300 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
} 