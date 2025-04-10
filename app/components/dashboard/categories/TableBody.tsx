"use client";

import { Column } from "./types";
import { Category } from "../../../login/login-definitions";

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
          className="w-full border-b border-zinc-300 py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg hover:bg-zinc-100 transition-colors"
        >
          {columns.map((column) => {
            const isActionsColumn = column.key === "actions";
            const isMobileVisible = ["id", "name", "actions"].includes(
              column.key
            );

            return (
              <td
                key={`${category.id}-${column.key}`}
                className={`whitespace-nowrap px-3 py-4 text-sm ${
                  isActionsColumn ? "" : "text-left"
                } ${isMobileVisible ? "table-cell" : "hidden md:table-cell"}`}
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
