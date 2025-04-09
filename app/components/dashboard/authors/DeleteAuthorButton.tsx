"use client";

import { DeleteAuthorButtonProps } from "./types";
import { TrashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export default function DeleteAuthorButton({
  authorId,
  authorName,
  onDelete,
  isDeleting,
}: DeleteAuthorButtonProps) {
  const handleDelete = async () => {
    const confirmPromise = new Promise<boolean>((resolve) => {
      toast(
        (t) => (
          <div className="flex flex-col items-center">
            <p className="mb-2">
              Are you sure you want to delete author "{authorName}"?
            </p>
            <div className="flex space-x-2">
              <button
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(true);
                }}
              >
                Delete
              </button>
              <button
                className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ),
        { duration: 5000 }
      );
    });

    const isConfirmed = await confirmPromise;
    if (!isConfirmed) return;

    try {
      await onDelete(authorId, authorName);
    } catch (error) {
      console.error("Error in DeleteAuthorButton:", error);
      toast.error("Failed to delete author");
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={`Delete author ${authorName}`}
    >
      <TrashIcon className="h-5 w-5" />
    </button>
  );
}
