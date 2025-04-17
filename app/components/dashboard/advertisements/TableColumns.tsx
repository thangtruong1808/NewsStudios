"use client";

import Link from "next/link";
import { Advertisement } from "../../../lib/definition";
import { Column } from "./types";
import { formatDate } from "../../../lib/utils/dateUtils";

export function getTableColumns(
  currentPage: number,
  itemsPerPage: number,
  handleDelete: (id: number, adType: string) => Promise<void>,
  isDeleting: boolean
): Column[] {
  return [
    {
      key: "sequence",
      label: "#",
      sortable: false,
      cell: (advertisement: Advertisement, index: number) => (
        <div className="whitespace-nowrap text-xs text-gray-500 sm:text-sm">
          {(currentPage - 1) * itemsPerPage + index + 1}
        </div>
      ),
    },
    {
      key: "id",
      label: "ID",
      sortable: true,
      cell: (advertisement: Advertisement) => (
        <div className="whitespace-nowrap text-xs text-gray-900 sm:text-sm">
          {advertisement.id}
        </div>
      ),
    },
    {
      key: "sponsor_name",
      label: "Sponsor",
      sortable: true,
      cell: (advertisement: Advertisement) => (
        <div className="whitespace-nowrap text-xs text-gray-900 sm:text-sm">
          {advertisement.sponsor_name}
        </div>
      ),
    },
    {
      key: "ad_type",
      label: "Type",
      sortable: true,
      cell: (advertisement: Advertisement) => (
        <div className="whitespace-nowrap text-xs text-gray-500 sm:text-sm">
          {advertisement.ad_type}
        </div>
      ),
    },
    {
      key: "ad_content",
      label: "Content",
      sortable: false,
      cell: (advertisement: Advertisement) => (
        <div className="max-w-xs truncate text-xs text-gray-500 sm:text-sm">
          {advertisement.ad_content}
        </div>
      ),
    },
    {
      key: "start_date",
      label: "Start Date",
      sortable: true,
      cell: (advertisement: Advertisement) => (
        <div className="whitespace-nowrap text-xs text-gray-500 sm:text-sm">
          {formatDate(advertisement.start_date)}
        </div>
      ),
    },
    {
      key: "end_date",
      label: "End Date",
      sortable: true,
      cell: (advertisement: Advertisement) => (
        <div className="whitespace-nowrap text-xs text-gray-500 sm:text-sm">
          {formatDate(advertisement.end_date)}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      cell: (advertisement: Advertisement) => (
        <div className="flex justify-end gap-2">
          <Link
            href={`/dashboard/advertisements/${advertisement.id}/edit`}
            className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
          >
            Edit
          </Link>
          <button
            onClick={() =>
              handleDelete(advertisement.id, advertisement.ad_type)
            }
            disabled={isDeleting}
            className="rounded border border-red-500 px-2 py-1 text-xs text-red-500 hover:bg-red-50 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];
}
