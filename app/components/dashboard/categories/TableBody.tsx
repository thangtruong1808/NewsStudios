"use client";

import type { Column } from "@/app/components/dashboard/shared/table/TableTypes";
import type { Category } from "@/app/lib/definition";

interface TableBodyProps {
  categories: Category[];
  columns: Column<Category>[];
}

// Description: Render table body rows for categories with responsive column visibility.
// Data created: 2024-11-13
// Author: thangtruong
export default function TableBody({
  categories,
  columns,
}: TableBodyProps) {
  return (
    <tbody className="divide-y divide-gray-200 bg-white">
      {categories.map((category) => (
        <tr
          key={category.id}
          className="hover:bg-gray-100 transition-colors duration-150"
        >
          {columns.map((column) => {
            const isMobileVisible = ["id", "name"].includes(column.field as string);

            return (
              <td
                key={`${category.id}-${String(column.field)}`}
                className={`whitespace-nowrap px-3 py-3 text-xs ${
                  isMobileVisible ? "table-cell" : "hidden md:table-cell"
                }`}
              >
                {column.render
                  ? column.render({
                      value: category[column.field as keyof Category],
                      row: category,
                    })
                  : String(category[column.field as keyof Category])}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
}
