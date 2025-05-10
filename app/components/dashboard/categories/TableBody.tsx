"use client";

import { Column } from "./types";
import { Category } from "../../../lib/definition";

interface TableBodyProps {
  categories: Category[];
  columns: Column[];
  currentPage: number;
  itemsPerPage: number;
}

export default function TableBody({
  categories,
  columns,
  currentPage,
  itemsPerPage,
}: TableBodyProps) {
  return (
    <tbody className="divide-y divide-gray-200 bg-white">
      {categories.map((category, index) => (
        <tr
          key={category.id}
          className="hover:bg-gray-100 transition-colors duration-150"
        >
          {columns.map((column) => {
            const isActionsColumn = column.key === "actions";
            const isSequenceColumn = column.key === "sequence";
            const isMobileVisible = ["id", "name", "actions"].includes(
              column.key
            );

            return (
              <td
                key={`${category.id}-${column.key}`}
                className={`whitespace-nowrap ${
                  isSequenceColumn ? "px-2 py-2" : "px-3 py-3"
                } text-xs ${isActionsColumn ? "text-center" : ""} ${
                  isMobileVisible ? "table-cell" : "hidden md:table-cell"
                }`}
              >
                {column.cell(
                  category,
                  (currentPage - 1) * itemsPerPage + index
                )}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
}
