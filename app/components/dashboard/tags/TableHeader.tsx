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
    <thead className="rounded-lg text-left text-sm font-normal bg-zinc-200">
      <tr>
        {columns.map((column) => {
          const isActionsColumn = column.key === "actions";
          const isSequenceColumn = column.key === "sequence";

          return (
            <th
              key={column.key}
              scope="col"
              className={`px-3 py-3 font-medium border-b border-zinc-300 ${
                isActionsColumn ? "text-center" : ""
              } ${isSequenceColumn ? "px-2" : ""}`}
              onClick={() => column.sortable && onSort(column.key as keyof Tag)}
            >
              <div
                className={`group inline-flex ${
                  isActionsColumn
                    ? "justify-center w-full"
                    : isSequenceColumn
                    ? "text-left"
                    : ""
                }`}
              >
                {column.label}
                {column.sortable && sortField === column.key && (
                  <span className="ml-1 flex-none rounded text-gray-400">
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
