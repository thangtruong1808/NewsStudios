"use client";

import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

interface TableHeaderProps {
  columns: any[];
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
}

export default function TableHeader({
  columns,
  sortField,
  sortDirection,
  onSort,
}: TableHeaderProps) {
  return (
    <thead className="rounded-lg text-left text-sm font-normal bg-zinc-200">
      <tr>
        {columns.map((column, index) => {
          const isMobileVisible = ["id", "name", "actions"].includes(
            column.accessorKey
          );
          return (
            <th
              key={index}
              scope="col"
              className={`${
                column.accessorKey === "actions"
                  ? "relative py-2 pl-4 pr-2 text-center border-b border-zinc-300"
                  : column.accessorKey === "sequence"
                  ? "px-2 py-3 text-left text-xs font-medium text-gray-900 sm:text-sm border-b border-zinc-300"
                  : `px-3 py-3 text-left text-xs font-medium text-gray-900 sm:text-sm ${
                      column.sortable ? "cursor-pointer hover:bg-gray-100" : ""
                    } border-b border-zinc-300`
              } ${isMobileVisible ? "table-cell" : "hidden md:table-cell"}`}
              onClick={() => column.sortable && onSort(column.accessorKey)}
            >
              <div
                className={`group inline-flex items-center ${
                  column.accessorKey === "actions"
                    ? "justify-center w-full"
                    : ""
                }`}
              >
                <span
                  className={`${
                    column.accessorKey === "actions"
                      ? "font-medium text-center"
                      : ""
                  }`}
                >
                  {column.header}
                </span>
                {column.sortable && sortField === column.accessorKey && (
                  <span className="ml-1 text-gray-500">
                    {sortDirection === "asc" ? (
                      <ChevronUpIcon className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
                    )}
                  </span>
                )}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
