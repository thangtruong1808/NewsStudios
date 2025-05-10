"use client";

import Link from "next/link";
import { Category } from "../../../lib/definition";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Column } from "./types";

export function getTableColumns(
  currentPage: number,
  itemsPerPage: number,
  handleDelete: (id: number, name: string) => Promise<void>,
  isDeleting: boolean
): Column[] {
  return [
    {
      key: "sequence",
      label: "#",
      sortable: false,
      cell: (category: Category, index: number) => (
        <div className="text-left text-xs text-gray-500 sm:text-sm">
          {(currentPage - 1) * itemsPerPage + index + 1}
        </div>
      ),
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
      cell: (category: Category) => (
        <div className="whitespace-nowrap text-xs font-medium text-gray-900 sm:text-sm">
          {category.name}
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      sortable: false,
      cell: (category: Category) => (
        <div className="whitespace-nowrap text-xs text-gray-500 sm:text-sm">
          {category.description || "No description"}
        </div>
      ),
    },
    {
      key: "created_at",
      label: "Created At",
      sortable: true,
      cell: (category: Category) => (
        <div className="whitespace-nowrap text-xs text-gray-500 sm:text-sm">
          {new Date(category.created_at).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: "updated_at",
      label: "Updated At",
      sortable: true,
      cell: (category: Category) => (
        <div className="whitespace-nowrap text-xs text-gray-500 sm:text-sm">
          {new Date(category.updated_at).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      cell: (category: Category) => (
        <div className="flex justify-center gap-4">
          <button
            onClick={() =>
              (window.location.href = `/dashboard/categories/${category.id}/edit`)
            }
            className="inline-flex items-center gap-1 rounded border border-blue-500 px-2.5 py-1.5 text-xs font-medium text-blue-500 hover:bg-blue-100"
          >
            <PencilIcon className="h-3.5 w-3.5" />
            Edit
          </button>
          <button
            onClick={() => handleDelete(category.id, category.name)}
            disabled={isDeleting}
            className="inline-flex items-center gap-1 rounded border border-red-500 px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-100 disabled:opacity-50"
          >
            <TrashIcon className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      ),
    },
  ];
}
