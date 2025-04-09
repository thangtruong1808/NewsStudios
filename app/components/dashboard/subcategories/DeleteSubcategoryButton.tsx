"use client";

import { TrashIcon } from "@heroicons/react/24/outline";

interface DeleteSubcategoryButtonProps {
  id: number;
  name: string;
  onDelete: (id: number, name: string) => void;
  isDeleting: boolean;
}

export default function DeleteSubcategoryButton({
  id,
  name,
  onDelete,
  isDeleting,
}: DeleteSubcategoryButtonProps) {
  return (
    <button
      onClick={() => onDelete(id, name)}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={`Delete subcategory ${name}`}
    >
      <TrashIcon className="h-5 w-5" />
    </button>
  );
}
