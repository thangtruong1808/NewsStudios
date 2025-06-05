"use client";

import { Image } from "@/app/lib/definition";
import { ClockIcon } from "@heroicons/react/24/outline";

interface PhotoMetadataProps {
  photo: Image;
}

export function PhotoMetadata({ photo }: PhotoMetadataProps) {
  return (
    <div className="p-4 space-y-2">
      <div className="flex items-center gap-1">
        <span className="text-xs font-medium">Article ID:</span>
        <span className="text-xs text-gray-500">
          {photo.article_id || "No article associated"}
        </span>
      </div>
      {photo.article_title && (
        <div className="mt-1">
          <div className="flex items-start gap-1">
            <span className="text-xs font-medium whitespace-nowrap">
              Article Title:
            </span>
            <div
              className={`text-xs text-gray-500 line-clamp-2 ${
                photo.article_title.length < 50
                  ? "min-h-[1rem]"
                  : "min-h-[2rem]"
              }`}
            >
              {photo.article_title}
            </div>
          </div>
        </div>
      )}
      {photo.description && (
        <div className="mt-1">
          <div className="flex items-start gap-1">
            <span className="text-xs font-medium whitespace-nowrap">
              Description:
            </span>
            <div className="text-xs text-gray-500 line-clamp-2">
              {photo.description}
            </div>
          </div>
        </div>
      )}
      <div className="mt-1 flex items-center gap-1">
        <span className="text-xs font-medium">Last updated:</span>
        <span className="text-xs text-gray-500">
          {new Date(photo.updated_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
        <ClockIcon className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
}
