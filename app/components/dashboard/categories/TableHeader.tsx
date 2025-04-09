"use client";

import { Column } from "./types";
import { Category } from "../../../type/definitions";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

interface TableHeaderProps {
  columns: Column[];
  sortField: keyof Category | null;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof Category) => void;
}

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
          // Show ID, name, and actions in mobile view
          const isMobileVisible = ["id", "name", "actions"].includes(
            column.key
          );
          const isActionsColumn = column.key === "actions";
          const isNameColumn = column.key === "name";

          return (
            <th
              key={column.key}
              scope="col"
              className={`px-2 py-2 text-left text-xs font-semibold text-gray-900 ${
                column.sortable ? "cursor-pointer" : ""
              } ${isMobileVisible ? "table-cell" : "hidden md:table-cell"} ${
                isActionsColumn ? "text-center" : ""
              }`}
              onClick={() =>
                column.sortable && onSort(column.key as keyof Category)
              }
            >
              <div
                className={`group inline-flex ${
                  isActionsColumn ? "justify-center w-full" : ""
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
