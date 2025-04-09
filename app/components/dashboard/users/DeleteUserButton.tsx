"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import { DeleteUserButtonProps } from "./types";

export default function DeleteUserButton({
  userId,
  userName,
  onDelete,
  isDeleting,
}: DeleteUserButtonProps) {
  return (
    <button
      onClick={() => onDelete(userId, userName)}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-900 disabled:opacity-50"
    >
      <TrashIcon className="h-5 w-5" />
    </button>
  );
}
