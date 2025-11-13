"use client";

import { Column } from "./TableTypes";

interface TableHeaderProps<T> {
  columns: Column<T>[];
  sortField?: keyof T;
  sortDirection?: "asc" | "desc";
  onSort?: (params: { field: keyof T }) => void;
}

// Description: Render table headers with optional sort indicators and handlers.
// Data created: 2024-11-13
// Author: thangtruong
export default function TableHeader<T>({
  columns,
  sortField,
  sortDirection,
  onSort,
}: TableHeaderProps<T>) {
  return (
    <thead className="bg-gray-50 ">
      <tr>
        {/* Map through columns to create header cells */}
        {columns.map((column) => (
          <th
            key={String(column.field)}
            scope="col"
            className={`px-2 py-3 text-sm font-medium ${
              column.field === "actions" ? "text-left" : "text-left"
            } ${
              column.sortable !== false
                ? "cursor-pointer hover:underline hover:text-blue-600 rounded-sm"
                : ""
            }`}
            onClick={() => {
              if (column.sortable === false) return;
              onSort?.({ field: column.field as keyof T });
            }}
          >
            {/* Column header content with sort indicator */}
            <div
              className={`group inline-flex items-center gap-1 ${
                column.field === "actions" ? "text-left" : ""
              }`}
            >
              {column.label}
              {/* Display sort direction indicator if column is being sorted */}
              {sortField === column.field && (
                <span className="ml-1 text-blue-500">
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
