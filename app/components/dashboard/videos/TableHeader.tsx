"use client";

import React from "react";
import { Video } from "../../../lib/definition";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

interface TableHeaderProps {
  sortField: keyof Video;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof Video) => void;
}

export function TableHeader({
  sortField,
  sortDirection,
  onSort,
}: TableHeaderProps) {
  const columns = [
    { key: "id", label: "ID" },
    { key: "article_title", label: "Article Title" },
    { key: "video_url", label: "Video URL" },
    { key: "description", label: "Description" },
    { key: "created_at", label: "Created At" },
    { key: "updated_at", label: "Updated At" },
  ];

  return (
    <thead className="rounded-lg text-left text-sm font-normal">
      <tr>
        {columns.map((column) => (
          <th
            key={column.key}
            scope="col"
            className="px-4 py-5 font-medium text-gray-900"
          >
            <button
              className="group inline-flex"
              onClick={() => onSort(column.key as keyof Video)}
            >
              {column.label}
              <span className="ml-2 flex-none rounded text-gray-400">
                {sortField === column.key ? (
                  sortDirection === "asc" ? (
                    <ChevronUpIcon className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                  )
                ) : null}
              </span>
            </button>
          </th>
        ))}
        <th scope="col" className="relative py-3 pl-3 pr-6">
          <span className="sr-only">Actions</span>
        </th>
      </tr>
    </thead>
  );
}
