import Image from "next/image";
import { PlayCircleIcon } from "@heroicons/react/24/outline";
import { MainMediaDisplayProps } from "./types";

export const MainMediaDisplay = ({
  selectedImage,
  article,
}: MainMediaDisplayProps) => (
  <div className="relative aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden">
    {selectedImage ? (
      <Image
        src={selectedImage}
        alt={article.title}
        fill
        className="object-fit group-hover:scale-105 transition-transform duration-300"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    ) : article.video ? (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-indigo-600">
        <PlayCircleIcon className="h-16 w-16 text-white opacity-80" />
      </div>
    ) : (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-indigo-600">
        <span className="text-4xl font-bold text-white">
          {article.title.charAt(0)}
        </span>
      </div>
    )}
  </div>
);
