"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteImage } from "../../lib/actions/images";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface DeleteButtonProps {
  imageId: number;
}

export default function DeleteButton({ imageId }: DeleteButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmPromise = new Promise<boolean>((resolve) => {
      toast(
        (t) => (
          <div className="flex flex-col items-center">
            <p className="mb-2">Are you sure you want to delete this image?</p>
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

    const toastId = toast.loading("Deleting image...");

    try {
      const result = await deleteImage(imageId);
      if (result.error) {
        toast.error(`Failed to delete image: ${result.error}`, {
          id: toastId,
        });
      } else {
        toast.success("Image deleted successfully", {
          id: toastId,
        });
        router.refresh();
      }
    } catch (error) {
      toast.error("An error occurred while deleting the image", {
        id: toastId,
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="inline-flex items-center gap-1 rounded border border-red-500 px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-100 min-w-[70px] justify-center"
    >
      <TrashIcon className="h-3.5 w-3.5" />
      <span>Delete</span>
    </button>
  );
}
