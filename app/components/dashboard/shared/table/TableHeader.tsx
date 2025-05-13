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
        {columns.map((column, index) => {
          // Skip rendering if it's the actions column and we're not in the last column
          if (column.field === "actions" && index !== columns.length - 1) {
            return null;
          }

          return (
            <th
              key={index}
              scope="col"
              className={`px-3 py-3.5 text-left text-sm font-semibold text-gray-900 ${
                column.sortable ? "cursor-pointer hover:bg-gray-100" : ""
              }`}
              onClick={() => column.sortable && onSort?.(column.field)}
            >
              <div className="group inline-flex items-center gap-2">
                {column.label}
                {column.sortable && sortField === column.field && (
                  <span className="text-gray-400">
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
