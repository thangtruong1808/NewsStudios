"use client";

import { useRouter } from "next/navigation";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function VideosHeader() {
  const router = useRouter();

  return (
    <div className="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Videos</h1>
        <p className="mt-2 text-sm text-gray-700">
          A list of all videos in your account including their title,
          description, and article association.
        </p>
      </div>
      <div className="mt-4 sm:mt-0">
        <button
          onClick={() => router.push("/dashboard/videos/create")}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add Video
        </button>
      </div>
    </div>
  );
}
