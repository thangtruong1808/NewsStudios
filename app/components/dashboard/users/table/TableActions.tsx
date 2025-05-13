"use client";

import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { TableActionsProps } from "../types";

/**
 * Component for rendering action buttons (edit/delete) for each user row
 */
export default function TableActions({
  user,
  onEdit,
  onDelete,
  isDeleting,
}: TableActionsProps) {
  return (
    <div className="flex space-x-2">
      <button
        onClick={() => onEdit(user.id)}
        className="inline-flex items-center gap-1 rounded border border-blue-500 px-3 py-1.5 text-sm font-medium text-blue-500 hover:bg-blue-50 transition-colors duration-200"
      >
        <PencilIcon className="h-4 w-4" />
        Edit
      </button>
      <button
        onClick={() => onDelete(user.id)}
        disabled={isDeleting}
        className="inline-flex items-center gap-1 rounded border border-red-500 px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
      >
        <TrashIcon className="h-4 w-4" />
        Delete
      </button>
    </div>
  );
}
