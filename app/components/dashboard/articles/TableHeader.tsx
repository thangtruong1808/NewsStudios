"use client";

import { Article } from "../../../lib/definition";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

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
      key: "updated_at" as keyof Article,
      label: "Updated",
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
    <thead className="rounded-lg text-left text-sm font-normal bg-zinc-200">
      <tr>
        {columns.map((column) => (
          <th
            key={column.key}
            className={`${
              column.key === ("sequence" as keyof Article)
                ? "px-2 py-3 font-medium border-b border-zinc-300"
                : column.key === ("actions" as keyof Article)
                ? "px-3 py-3 font-medium border-b border-zinc-300 text-center"
                : column.key === ("title" as keyof Article)
                ? "px-3 py-3 font-medium border-b border-zinc-300 w-[200px]"
                : `px-3 py-3 font-medium ${
                    column.sortable ? "cursor-pointer hover:bg-gray-100" : ""
                  } border-b border-zinc-300`
            }`}
            onClick={() => column.sortable !== false && onSort(column.key)}
          >
            <div
              className={`group inline-flex items-center ${
                column.key === ("actions" as keyof Article)
                  ? "justify-center"
                  : ""
              }`}
            >
              <span>{column.label}</span>
              {column.sortable && sortField === column.key && (
                <span className="ml-1 text-gray-500">
                  {sortDirection === "asc" ? "↑" : "↓"}
                </span>
              )}
            </div>
          </th>
        ))}
        <th className="px-3 py-3 font-medium border-b border-zinc-300 text-center">
          <span>Actions</span>
        </th>
      </tr>
    </thead>
  );
}
