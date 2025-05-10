"use client";

import Link from "next/link";
import { Tag } from "../../../lib/definition";
import { Column } from "./types";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

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
        <div className="text-left text-xs text-gray-500 sm:text-sm">
          {(currentPage - 1) * itemsPerPage + index + 1}
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
      key: "created_at",
      label: "Created At",
      sortable: true,
      cell: (tag: Tag) => (
        <div className="whitespace-nowrap text-xs text-gray-500 sm:text-sm">
          {new Date(tag.created_at).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </div>
      ),
    },
    {
      key: "updated_at",
      label: "Updated At",
      sortable: true,
      cell: (tag: Tag) => (
        <div className="whitespace-nowrap text-xs text-gray-500 sm:text-sm">
          {new Date(tag.updated_at).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      cell: (tag: Tag) => (
        <div className="whitespace-nowrap text-xs text-gray-500 sm:text-sm">
          <div className="flex justify-center gap-4">
            <Link
              href={`/dashboard/tags/${tag.id}/edit`}
              className="inline-flex items-center gap-1 rounded border border-blue-500 px-2.5 py-1.5 text-xs font-medium text-blue-500 hover:bg-blue-100"
            >
              <PencilIcon className="h-3.5 w-3.5" />
              Edit
            </Link>
            <button
              onClick={() => onDelete(tag.id, tag.name)}
              disabled={isDeleting}
              className="inline-flex items-center gap-1 rounded border border-red-500 px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-100 disabled:opacity-50"
            >
              <TrashIcon className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        </div>
      ),
    },
  ];
}
