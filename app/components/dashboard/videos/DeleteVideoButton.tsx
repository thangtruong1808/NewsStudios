"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteVideo } from "@/app/lib/actions/videos";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface DeleteVideoButtonProps {
  videoId: number;
}

export default function DeleteVideoButton({ videoId }: DeleteVideoButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const result = await deleteVideo(videoId);
      if (result.error) {
        throw new Error(result.error);
      }
      toast.success("Video deleted successfully");
      router.refresh();
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete video"
      );
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <TrashIcon className="h-5 w-5" />
    </button>
  );
}
