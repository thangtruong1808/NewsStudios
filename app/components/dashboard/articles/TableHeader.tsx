"use client";

import { Article } from "../../../lib/definition";
import {
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

interface TableHeaderProps {
  sortField: keyof Article;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof Article) => void;
}

export function TableHeader({
  sortField,
  sortDirection,
  onSort,
}: TableHeaderProps) {
  const columns = [
    {
      key: "sequence" as keyof Article,
      label: "#",
      sortable: false,
    },
    {
      key: "id" as keyof Article,
      label: "ID",
      sortable: false,
    },
    { key: "title" as keyof Article, label: "Title" },
    { key: "content" as keyof Article, label: "Content" },
    {
      key: "category_id" as keyof Article,
      label: "Category",
    },
    { key: "author_id" as keyof Article, label: "Author" },
    {
      key: "published_at" as keyof Article,
      label: "Published",
    },
    {
      key: "is_featured" as keyof Article,
      label: "Featured",
    },
    {
      key: "is_trending" as keyof Article,
      label: "Trending",
    },
  ];

  return (
    <thead>
      <tr className="border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-900">
        {columns.map((column) => (
          <th
            key={column.key}
            className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
            onClick={() =>
              column.sortable !== false &&
              onSort(column.key)
            }
          >
            <div className="flex items-center gap-1">
              {column.label}
              {sortField === column.key &&
                (sortDirection === "asc" ? (
                  <ChevronUpIcon className="h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4" />
                ))}
            </div>
          </th>
        ))}
        <th className="px-4 py-3 text-right">Actions</th>
      </tr>
    </thead>
  );
}
