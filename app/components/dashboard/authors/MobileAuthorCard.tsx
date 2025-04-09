"use client";

import { Author } from "../../../type/definitions";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface MobileAuthorCardProps {
  author: Author;
  onDelete: (id: number, authorName: string) => Promise<void>;
  isDeleting: boolean;
}

export default function MobileAuthorCard({
  author,
  onDelete,
  isDeleting,
}: MobileAuthorCardProps) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/dashboard/author/${author.id}/edit`);
  };

  const handleDelete = async () => {
    const confirmPromise = new Promise<boolean>((resolve) => {
      toast(
        (t) => (
          <div className="flex flex-col items-center">
            <p className="mb-2">
              Are you sure you want to delete author "{author.name}"?
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
      await onDelete(author.id, author.name);
    } catch (error) {
      console.error("Error in MobileAuthorCard:", error);
      toast.error("Failed to delete author");
    }
  };

  return (
    <div className="mb-2 w-full rounded-md bg-white p-4">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <div className="mb-2 flex items-center">
            <p className="font-medium text-gray-900">
              ID: {author.id} - {author.name}
            </p>
          </div>
          <p className="text-sm text-gray-500">
            {author.description || "No description"}
          </p>
          {author.bio && (
            <p className="mt-2 text-sm text-gray-500">
              <span className="font-medium">Bio:</span> {author.bio}
            </p>
          )}
          <div className="mt-2 text-xs text-gray-500">
            <p>
              Created:{" "}
              {author.created_at
                ? new Date(author.created_at).toLocaleDateString()
                : "-"}
            </p>
            <p>
              Updated:{" "}
              {author.updated_at
                ? new Date(author.updated_at).toLocaleDateString()
                : "-"}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
