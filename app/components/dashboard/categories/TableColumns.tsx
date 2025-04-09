"use client";

import Link from "next/link";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Category } from "../../../type/definitions";
import { Column } from "./types";

export function getTableColumns(
  currentPage: number,
  itemsPerPage: number,
  handleDelete: (id: number, categoryName: string) => void,
  isDeleting: boolean
): Column[] {
  return [
    {
      key: "id",
      label: "ID",
      sortable: false,
      cell: (category: Category, index: number) => (
        <div className="whitespace-nowrap text-xs font-medium text-gray-900 sm:text-sm">
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
        <div className="whitespace-nowrap text-xs text-gray-500 hidden md:table-cell sm:text-sm">
          {category.description || "No description"}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      cell: (category: Category) => (
        <div className="whitespace-nowrap text-xs text-gray-500 sm:text-sm">
          <div className="flex justify-center gap-2 p-3">
            <Link
              href={`/dashboard/categories/${category.id}/edit`}
              className="text-indigo-600 hover:text-indigo-900"
            >
              <PencilIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
            <button
              onClick={() => handleDelete(category.id, category.name)}
              disabled={isDeleting}
              className="text-red-600 hover:text-red-900 disabled:opacity-50"
            >
              <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      ),
    },
  ];
}
