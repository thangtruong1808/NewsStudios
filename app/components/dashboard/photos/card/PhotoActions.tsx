"use client";

import { Image } from "@/app/lib/definition";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";

interface PhotoActionsProps {
  photo: Image;
  onEdit: (_photo: Image) => void;
  onDelete: (_photo: Image) => void;
  isDeleting: boolean;
  isVisible: boolean;
}

export function PhotoActions({
  photo,
  onEdit,
  onDelete,
  isDeleting,
  isVisible,
}: PhotoActionsProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  if (!isAdmin) {
    return null;
  }

  return (
    <div
      className={`absolute top-2 right-2 flex gap-2 transition-opacity duration-200 ${isVisible ? "opacity-100" : "opacity-0"
        }`}
    >
      <button
        onClick={() => onEdit(photo)}
        className="p-2 rounded-full bg-white text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
        title="Edit photo"
      >
        <PencilIcon className="h-5 w-5" />
      </button>
      <button
        onClick={() => onDelete(photo)}
        disabled={isDeleting}
        className="p-2 rounded-full bg-white text-gray-700 hover:bg-gray-100 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        title="Delete photo"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
