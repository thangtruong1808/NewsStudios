"use client";

import { Column } from "./types";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

interface TableHeaderProps {
  columns: Column[];
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (_field: string) => void;
}

export function TableHeader({
  columns,
  sortField,
  sortDirection,
  onSort,
}: TableHeaderProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => {
              const isMobileVisible = ["id", "name", "actions"].includes(
                column.field
              );
              return (
                <th
                  key={column.field}
                  scope="col"
                  className={`${column.field === "actions"
                    ? "relative py-2 pl-4 pr-2 text-center border-b border-zinc-300"
                    : column.field === "sequence"
                      ? "px-2 py-3 text-left text-xs font-medium text-gray-900 sm:text-sm border-b border-zinc-300"
                      : `px-3 py-3 text-left text-xs font-medium text-gray-900 sm:text-sm ${column.sortable ? "cursor-pointer hover:bg-gray-100" : ""
                      } border-b border-zinc-300`
                    } ${isMobileVisible ? "table-cell" : "hidden md:table-cell"}`}
                  onClick={() => column.sortable && onSort(column.field)}
                >
                  <div
                    className={`group inline-flex items-center ${column.field === "actions" ? "justify-center" : ""
                      }`}
                  >
                    <span className={column.field === "actions" ? "font-medium" : ""}>
                      {column.label}
                    </span>
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
      </table>
    </div>
  );
}
