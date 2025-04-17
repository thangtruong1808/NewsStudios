"use client";

import { Column, TableHeaderProps } from "./types";

export default function TableHeader({
  columns,
  sortField,
  sortDirection,
  onSort,
}: TableHeaderProps) {
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
              {column.sortable && sortField === column.key && (
                <span className="ml-1 text-gray-500">
                  {sortDirection === "asc" ? "↑" : "↓"}
                </span>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}
