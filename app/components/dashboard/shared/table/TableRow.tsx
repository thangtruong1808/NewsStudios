"use client";

import { ReactNode } from "react";
import { Column } from "./TableTypes";

interface TableRowProps<T> {
  item: T;
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  isDeleting?: boolean;
  index: number;
  currentPage: number;
  itemsPerPage: number;
}

export default function TableRow<T>({
  item,
  columns,
  onEdit,
  onDelete,
  isDeleting,
  index,
  currentPage,
  itemsPerPage,
}: TableRowProps<T>) {
  // Calculate the sequence number based on current page and items per page
  const sequence = (currentPage - 1) * itemsPerPage + index + 1;

  return (
    <tr className="hover:bg-gray-50">
      {columns.map((column, colIndex) => {
        // Skip rendering if it's the actions column and we're not in the last column
        if (column.field === "actions" && colIndex !== columns.length - 1) {
          return null;
        }

        return (
          <td
            key={colIndex}
            className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
          >
            {column.field === "sequence"
              ? sequence
              : column.render
              ? column.render((item as any)[column.field], item)
              : (item as any)[column.field]}
          </td>
        );
      })}
    </tr>
  );
}
