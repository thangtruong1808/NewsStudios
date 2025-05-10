"use client";

import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

interface Column {
  key: string;
  label: string;
  sortable: boolean;
}

interface TableHeaderProps<T> {
  columns: Column[];
  sortField: keyof T;
  sortDirection: "asc" | "desc";
  onSort: (field: keyof T) => void;
}

export default function TableHeader<T>({
  columns,
  sortField,
  sortDirection,
  onSort,
}: TableHeaderProps<T>) {
  return (
    <thead className="rounded-lg text-left text-sm font-normal bg-zinc-200">
      <tr>
        {columns.map((column) => {
          const isMobileVisible = ["sequence", "name", "actions"].includes(
            column.key
          );
          return (
            <th
              key={column.key}
              scope="col"
              className={`${
                column.key === "sequence"
                  ? "px-2 py-3 font-medium border-b border-zinc-300"
                  : column.key === "actions"
                  ? "px-3 py-3 font-medium border-b border-zinc-300 text-center"
                  : `px-3 py-3 font-medium ${
                      column.sortable ? "cursor-pointer hover:bg-gray-100" : ""
                    } border-b border-zinc-300`
              } ${isMobileVisible ? "table-cell" : "hidden md:table-cell"}`}
              onClick={() => column.sortable && onSort(column.key as keyof T)}
            >
              <div
                className={`group inline-flex items-center ${
                  column.key === "actions" ? "justify-center" : ""
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
          );
        })}
      </tr>
    </thead>
  );
}
