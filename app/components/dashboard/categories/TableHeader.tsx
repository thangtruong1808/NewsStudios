"use client";

import { Column } from "./types";
import { Category } from "../../../lib/definition";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

interface TableHeaderProps {
  columns: Column<Category>[];
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
}

// Description: Render table header with sortable columns and responsive visibility rules.
// Data created: 2024-11-13
// Author: thangtruong
export function TableHeader({
  columns,
  sortField,
  sortDirection,
  onSort,
}: TableHeaderProps) {
  return (
    <thead className="bg-gray-50">
      <tr>
        {columns.map((column) => {
          const isMobileVisible = ["id", "name"].includes(column.field);
          return (
            <th
              key={column.field}
              scope="col"
              className={`px-3 py-3 text-left text-xs font-medium text-gray-900 sm:text-sm ${column.sortable ? "cursor-pointer hover:bg-gray-100" : ""
                } border-b border-zinc-300 ${isMobileVisible ? "table-cell" : "hidden md:table-cell"
                }`}
              onClick={() => column.sortable && onSort(column.field)}
            >
              <div className="group inline-flex items-center">
                <span>{column.label}</span>
                {column.sortable && sortField === column.field && (
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
