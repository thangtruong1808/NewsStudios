"use client";

import { useRouter } from "next/navigation";
import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteVideo } from "@/app/lib/actions/videos";
import { toast } from "react-hot-toast";
import { useState } from "react";

interface DeleteVideoButtonProps {
  videoId: number;
  onDelete?: () => void;
}

export default function DeleteVideoButton({
  videoId,
  onDelete,
}: DeleteVideoButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <TrashIcon className="h-10 w-10 text-red-600" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Delete Video
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Are you sure you want to delete this video? This action cannot
                  be undone.
                </p>
              </div>
            </div>
            <div className="mt-4 flex space-x-3">
              <button
                onClick={async () => {
                  toast.dismiss(t.id);
                  try {
                    setIsDeleting(true);
                    const result = await deleteVideo(videoId);
                    if (result.error) {
                      throw new Error(result.error);
                    }
                    toast.success("Video deleted successfully");
                    if (onDelete) {
                      onDelete();
                    }
                    router.refresh();
                  } catch (error) {
                    console.error("Error deleting video:", error);
                    toast.error(
                      error instanceof Error
                        ? error.message
                        : "Failed to delete video"
                    );
                  } finally {
                    setIsDeleting(false);
                  }
                }}
                className="flex-1 bg-red-600 text-white px-4 py-2 text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                }}
                className="flex-1 bg-white text-gray-700 px-4 py-2 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
      }
    );
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex items-center gap-1 rounded border border-red-500 px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-100 min-w-[70px] justify-center disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <TrashIcon className="h-3.5 w-3.5" />
      <span>{isDeleting ? "Deleting..." : "Delete"}</span>
    </button>
  );
}
