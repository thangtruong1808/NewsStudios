"use client";

import Link from "next/link";
import { Tag } from "../../../lib/definition";
import { Column } from "./types";

export function getTableColumns(
  currentPage: number,
  itemsPerPage: number,
  onDelete: (id: number, name: string) => void,
  isDeleting: boolean
): Column[] {
  return [
    {
      key: "sequence",
      label: "#",
      sortable: false,
      cell: (
        tag: Tag,
        index: number,
        currentPage: number,
        itemsPerPage: number
      ) => (
        <div className="whitespace-nowrap text-xs font-medium text-gray-900 sm:text-sm text-center">
          {(currentPage - 1) * itemsPerPage + index + 1}
        </div>
      ),
    },
    {
      key: "id",
      label: "ID",
      sortable: true,
      cell: (tag: Tag) => (
        <div className="whitespace-nowrap text-xs font-medium text-gray-900 sm:text-sm text-center">
          {tag.id}
        </div>
      ),
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
      cell: (tag: Tag) => (
        <div className="whitespace-nowrap text-xs font-medium text-gray-900 sm:text-sm">
          {tag.name}
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      sortable: true,
      cell: (tag: Tag) => (
        <div className="whitespace-nowrap text-xs text-gray-500 hidden md:table-cell sm:text-sm">
          {tag.description || "-"}
        </div>
      ),
    },
    {
      key: "color",
      label: "Color",
      sortable: false,
      cell: (tag: Tag) => (
        <div className="whitespace-nowrap text-xs text-gray-500 hidden md:table-cell sm:text-sm">
          <div className="flex items-center">
            <div
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: tag.color }}
            />
            <span className="ml-2">{tag.color}</span>
          </div>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      cell: (tag: Tag) => (
        <div className="whitespace-nowrap text-xs text-gray-500 sm:text-sm">
          <div className="flex justify-center gap-2">
            <Link
              href={`/dashboard/tags/${tag.id}/edit`}
              className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
            >
              Edit
            </Link>
            <button
              onClick={() => onDelete(tag.id, tag.name)}
              disabled={isDeleting}
              className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
      ),
    },
  ];
}
