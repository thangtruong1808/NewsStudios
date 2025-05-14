"use client";

import { Column } from "./TableTypes";

interface TableHeaderProps<T> {
  columns: Column<T>[];
  sortField?: keyof T;
  sortDirection?: "asc" | "desc";
  onSort?: (field: keyof T) => void;
}

export default function TableHeader<T>({
  columns,
  sortField,
  sortDirection,
  onSort,
}: TableHeaderProps<T>) {
  return (
    <thead className="bg-gray-50">
      <tr>
        {columns.map((column) => (
          <th
            key={String(column.field)}
            scope="col"
            className={`px-3 py-3.5 text-sm font-semibold text-gray-900 ${
              column.field === "actions" ? "text-left" : "text-left"
            } ${
              column.sortable !== false
                ? "cursor-pointer hover:bg-gray-100"
                : ""
            }`}
            onClick={() =>
              column.sortable !== false && onSort?.(column.field as keyof T)
            }
          >
            <div
              className={`group inline-flex items-center gap-1 ${
                column.field === "actions" ? "text-left" : ""
              }`}
            >
              {column.label}
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
