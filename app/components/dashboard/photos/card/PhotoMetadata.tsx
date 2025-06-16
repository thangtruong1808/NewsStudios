"use client";

import { Image } from "@/app/lib/definition";
import { ClockIcon } from "@heroicons/react/24/outline";
import { formatDateToLocal } from "@/app/lib/utils/dateFormatter";

interface PhotoMetadataProps {
  photo: Image;
}

export function PhotoMetadata({ photo }: PhotoMetadataProps) {
  return (
    <div className="p-2 space-y-2">
      <div className="flex items-center gap-1">
        <span className="text-xs font-medium">Article ID:</span>
        <span className="text-xs text-gray-500">
          {photo.article_id || "No article associated"}
        </span>
      </div>
      {photo.article_title && (
        <div>
          <div className="flex items-start gap-1">
            <span className="text-xs font-medium whitespace-nowrap">
              Article Title:
            </span>
            <div
              className="text-xs text-gray-500 truncate"
            // className={`text-xs text-gray-500 truncate ${photo.article_title.length < 550
            //   ? "min-h-[1rem]"
            //   : "min-h-[2rem]"
            //   }`}
            >
              {photo.article_title}
            </div>
          </div>
        </div>
      )}
      <div>
        <div className="flex items-start gap-1">
          <span className="text-xs font-medium whitespace-nowrap">
            Description:
          </span>
          <div className="text-xs text-gray-500 truncate">
            {photo.description || "No description available"}
          </div>
        </div>
      </div>
      <div className="mt-1 flex items-center gap-1">
        <span className="text-xs font-medium">Last updated:</span>
        <span className="text-xs text-gray-500">
          {formatDateToLocal(photo.updated_at)}
        </span>
        <ClockIcon className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
}
