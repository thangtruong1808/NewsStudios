"use client";

import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { TableHeaderProps } from "./types";
import { Tag } from "../../../lib/definition";

export default function TableHeader({
  columns,
  sortField,
  sortDirection,
  onSort,
}: TableHeaderProps) {
  return (
    <thead>
      <tr>
        {columns.map((column) => {
          // Show ID, name, color, and actions in mobile view
          const isMobileVisible = ["id", "name", "color", "actions"].includes(
            column.key
          );
          const isActionsColumn = column.key === "actions";
          const isNameColumn = column.key === "name";
          const isSequenceColumn = column.key === "sequence";
          const isIdColumn = column.key === "id";

          return (
            <th
              key={column.key}
              scope="col"
              className={`px-6 py-4 text-left text-xs font-semibold text-gray-900 ${
                column.sortable ? "cursor-pointer" : ""
              } ${isMobileVisible ? "table-cell" : "hidden md:table-cell"} ${
                isActionsColumn ? "text-center" : ""
              } ${isSequenceColumn || isIdColumn ? "text-center" : ""}`}
              onClick={() => column.sortable && onSort(column.key as keyof Tag)}
            >
              <div
                className={`group inline-flex ${
                  isActionsColumn || isSequenceColumn || isIdColumn
                    ? "justify-center w-full"
                    : ""
                }`}
              >
                {column.label}
                {isNameColumn && (
                  <span className="ml-1 flex-none rounded text-gray-400">
                    {sortField === column.key ? (
                      sortDirection === "asc" ? (
                        <ChevronUpIcon className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <ChevronDownIcon
                          className="h-4 w-4"
                          aria-hidden="true"
                        />
                      )
                    ) : (
                      <ChevronUpIcon className="h-4 w-4" aria-hidden="true" />
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
