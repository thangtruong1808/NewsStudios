"use client";

import { Column } from "./types";
import { SubCategory } from "../../../lib/definition";

interface TableBodyProps {
  subcategories: SubCategory[];
  columns: Column[];
  currentPage: number;
  itemsPerPage: number;
}

export default function TableBody({
  subcategories,
  columns,
  currentPage,
  itemsPerPage,
}: TableBodyProps) {
  return (
    <tbody className="divide-y divide-gray-200 bg-white">
      {subcategories.map((subcategory, index) => (
        <tr
          key={subcategory.id}
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
                key={`${subcategory.id}-${column.key}`}
                className={`whitespace-nowrap ${
                  isSequenceColumn ? "px-2 py-2" : "px-3 py-3"
                } text-xs ${isActionsColumn ? "text-center" : ""} ${
                  isMobileVisible ? "table-cell" : "hidden md:table-cell"
                }`}
              >
                {column.cell(
                  subcategory,
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
