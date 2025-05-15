"use client";

import { Column } from "./TableTypes";

/**
 * Props interface for the TableHeader component
 * @template T - The type of data being displayed in the table
 */
interface TableHeaderProps<T> {
  columns: Column<T>[]; // Array of column configurations
  sortField?: keyof T; // Currently active sort field
  sortDirection?: "asc" | "desc"; // Current sort direction
  onSort?: (field: keyof T) => void; // Callback function for sort events
}

/**
 * TableHeader Component
 * Renders the header row of a table with sortable columns and sort indicators.
 * Supports dynamic column configuration and sorting functionality.
 * @template T - The type of data being displayed in the table
 */
export default function TableHeader<T>({
  columns,
  sortField,
  sortDirection,
  onSort,
}: TableHeaderProps<T>) {
  return (
    <thead className="bg-gray-50">
      <tr>
        {/* Map through columns to create header cells */}
        {columns.map((column) => (
          <th
            key={String(column.field)}
            scope="col"
            className={`px-3 py-3.5 text-sm font-medium text-gray-900 ${
              column.field === "actions" ? "text-left" : "text-left"
            } ${
              column.sortable !== false
                ? "cursor-pointer hover:underline hover:text-blue-600 rounded-sm"
                : ""
            }`}
            onClick={() =>
              column.sortable !== false && onSort?.(column.field as keyof T)
            }
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
