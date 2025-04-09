"use client";

import { TableBodyProps } from "./types";

export default function TableBody({
  authors,
  columns,
  currentPage,
  itemsPerPage,
}: TableBodyProps) {
  return (
    <tbody className="divide-y divide-gray-200 bg-white">
      {authors.map((author, index) => (
        <tr
          key={author.id}
          className="hover:bg-gray-100 transition-colors duration-150"
        >
          {columns.map((column) => {
            const isActionsColumn = column.key === "actions";
            const isMobileVisible = ["id", "name", "bio", "actions"].includes(
              column.key
            );

            return (
              <td
                key={`${author.id}-${column.key}`}
                className={`whitespace-nowrap px-2 py-2 text-xs ${
                  isActionsColumn ? "text-center" : ""
                } ${isMobileVisible ? "table-cell" : "hidden md:table-cell"}`}
              >
                {column.cell(author, (currentPage - 1) * itemsPerPage + index)}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
}
