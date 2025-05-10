"use client";

import { Article } from "../../../lib/definition";
import PhotoUploadForm from "./PhotoUploadForm";
import { useState, useEffect } from "react";
import Link from "next/link";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface CreatePhotoPageClientProps {
  articles: Article[];
}

export default function CreatePhotoPageClient({
  articles,
}: CreatePhotoPageClientProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set loading to false after component mounts
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl">Upload New Photo</h1>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Upload New Photo
        </h1>
      </div>
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <PhotoUploadForm articles={articles} />
        </div>
      </div>
    </div>
  );
}
