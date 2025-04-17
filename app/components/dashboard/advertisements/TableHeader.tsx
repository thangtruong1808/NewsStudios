"use client";

import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Column, TableHeaderProps } from "./types";

export default function TableHeader({
  columns,
  sortField,
  sortDirection,
  onSort,
}: TableHeaderProps) {
  const getSortIcon = (column: Column) => {
    if (!column.sortable) return null;
    if (sortField !== column.key) return null;
    return sortDirection === "asc" ? (
      <ChevronUpIcon className="h-4 w-4" />
    ) : (
      <ChevronDownIcon className="h-4 w-4" />
    );
  };

  return (
    <thead className="bg-gray-50">
      <tr>
        {columns.map((column) => (
          <th
            key={column.key}
            scope="col"
            className={`px-3 py-3.5 text-left text-sm font-semibold text-gray-900 ${
              column.sortable ? "cursor-pointer select-none" : ""
            }`}
            onClick={() => column.sortable && onSort(column.key)}
          >
            <div className="group inline-flex">
              {column.label}
              <span className="ml-2 flex-none rounded text-gray-400">
                {getSortIcon(column)}
              </span>
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}
