"use client";

import Link from "next/link";
import { Category } from "../../../type/definitions";
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
        <div className="whitespace-nowrap text-xs text-gray-500 sm:text-sm">
          {(currentPage - 1) * itemsPerPage + index + 1}
        </div>
      ),
    },
    {
      key: "id",
      label: "ID",
      sortable: true,
      cell: (category: Category) => (
        <div className="whitespace-nowrap text-xs text-gray-900 sm:text-sm">
          {category.id}
        </div>
      ),
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
      cell: (category: Category) => (
        <div className="whitespace-nowrap text-xs text-gray-900 sm:text-sm">
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
        <div className="flex justify-center gap-2">
          <Link
            href={`/dashboard/categories/${category.id}/edit`}
            className="rounded border border-blue-500 px-3 py-1 text-blue-500 hover:bg-blue-50"
          >
            Edit
          </Link>
          <button
            onClick={() => handleDelete(category.id, category.name)}
            disabled={isDeleting}
            className="rounded border border-red-500 px-3 py-1 text-red-500 hover:bg-red-50 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];
}
