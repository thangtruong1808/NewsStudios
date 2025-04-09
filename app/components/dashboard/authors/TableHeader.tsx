"use client";

import { TableHeaderProps } from "./types";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Author } from "../../../type/definitions";

export default function TableHeader({
  columns,
  sortField,
  sortDirection,
  onSort,
}: TableHeaderProps) {
  return (
    <thead className="bg-gray-50">
      <tr>
        {columns.map((column) => {
          const isMobileVisible = ["id", "name", "bio", "actions"].includes(
            column.key
          );
          return (
            <th
              key={column.key}
              scope="col"
              className={`px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                column.sortable ? "cursor-pointer hover:bg-gray-100" : ""
              } ${isMobileVisible ? "table-cell" : "hidden md:table-cell"}`}
              onClick={() =>
                column.sortable && onSort(column.key as keyof Author)
              }
            >
              <div className="flex items-center space-x-1">
                <span>{column.label}</span>
                {column.sortable && sortField === column.key && (
                  <span>
                    {sortDirection === "asc" ? (
                      <ChevronUpIcon className="h-4 w-4" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4" />
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
