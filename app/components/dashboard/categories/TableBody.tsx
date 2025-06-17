"use client";

import { Column } from "./types";
import { Category } from "../../../lib/definition";

interface TableBodyProps {
  categories: Category[];
  columns: Column<Category>[];
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
            const isMobileVisible = ["id", "name"].includes(column.field);

            return (
              <td
                key={`${category.id}-${column.field}`}
                className={`whitespace-nowrap px-3 py-3 text-xs ${isMobileVisible ? "table-cell" : "hidden md:table-cell"
                  }`}
              >
                {column.render?.(category[column.field], category) ?? String(category[column.field])}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
}
