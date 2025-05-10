"use client";

import { Column } from "./types";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Category } from "../../../lib/definition";

interface TableHeaderProps {
  columns: Column[];
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
}

export function TableHeader({
  columns,
  sortField,
  sortDirection,
  onSort,
}: TableHeaderProps) {
  return (
    <thead className="rounded-lg text-left text-sm font-normal bg-zinc-200">
      <tr>
        {columns.map((column) => {
          const isMobileVisible = ["id", "name", "actions"].includes(
            column.key
          );
          return (
            <th
              key={column.key}
              scope="col"
              className={`${
                column.key === "actions"
                  ? "relative py-2 pl-4 pr-2 text-center border-b border-zinc-300"
                  : column.key === "sequence"
                  ? "px-2 py-3 text-left text-xs font-medium text-gray-900 sm:text-sm border-b border-zinc-300"
                  : `px-3 py-3 text-left text-xs font-medium text-gray-900 sm:text-sm ${
                      column.sortable ? "cursor-pointer hover:bg-gray-100" : ""
                    } border-b border-zinc-300`
              } ${isMobileVisible ? "table-cell" : "hidden md:table-cell"}`}
              onClick={() => column.sortable && onSort(column.key)}
            >
              <div
                className={`group inline-flex items-center ${
                  column.key === "actions" ? "justify-center" : ""
                }`}
              >
                <span className={column.key === "actions" ? "font-medium" : ""}>
                  {column.label}
                </span>
                {column.sortable && sortField === column.key && (
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
