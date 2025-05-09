import Image from "next/image";
import { VideoCameraIcon } from "@heroicons/react/24/outline";
import { MediaThumbnailProps } from "./types";

export const MediaThumbnail = ({
  type,
  item,
  onClick,
}: MediaThumbnailProps) => (
  <div
    className="relative aspect-square bg-gray-100 rounded-md overflow-hidden group cursor-pointer"
    onClick={(e) => {
      e.preventDefault();
      onClick(item.url);
    }}
  >
    {type === "image" ? (
      <>
        <Image
          src={item.url}
          alt="Media thumbnail"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </>
    ) : (
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center space-y-1">
            <VideoCameraIcon className="h-6 w-6 text-white opacity-100" />
            <span className="text-base text-white font-medium">Watch</span>
          </div>
        </div>
      </div>
    )}
  </div>
);
