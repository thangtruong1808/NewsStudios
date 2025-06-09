"use client";

import { Column } from "./TableTypes";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

interface TableRowProps<T extends { id: number }> {
  item: T;
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  isDeleting?: boolean;
  index?: number;
  currentPage?: number;
  itemsPerPage?: number;
}

export default function TableRow<T extends { id: number }>({
  item,
  columns,
  onEdit,
  onDelete,
  isDeleting,
  index,
  currentPage = 1,
  itemsPerPage = 10,
}: TableRowProps<T>) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const pathname = usePathname();
  const isTagsTable = pathname.includes("/dashboard/tags");

  // Calculate sequence number
  const sequence =
    index !== undefined
      ? (currentPage - 1) * itemsPerPage + index + 1
      : undefined;

  // Filter out the actions column if it exists
  const displayColumns = columns.filter((column) => column.field !== "actions");

  return (
    <tr className="hover:bg-gray-100">
      {displayColumns.map((column) => (
        <td
          key={String(column.field)}
          className="whitespace-nowrap px-2 py-4 text-sm"
        >
          {column.render
            ? column.render(
                column.field === "sequence"
                  ? String(sequence)
                  : (item[column.field as keyof T] as string),
                item
              )
            : String(item[column.field as keyof T])}
        </td>
      ))}
      {isAdmin && (onEdit || onDelete) && (
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          <div className="flex justify-start space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(item)}
                className="inline-flex items-center gap-1 rounded border border-blue-500 px-2.5 py-1 text-sm font-medium text-blue-500 hover:bg-blue-50 transition-colors duration-200"
              >
                <PencilIcon className="h-3.5 w-3.5" />
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(item)}
                disabled={isDeleting}
                className="inline-flex items-center gap-1 rounded border border-red-500 px-2.5 py-1 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
              >
                <TrashIcon className="h-3.5 w-3.5" />
                Delete
              </button>
            )}
          </div>
        </td>
      )}
    </tr>
  );
}
