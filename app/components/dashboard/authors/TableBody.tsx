"use client";

import { Author } from "../../../type/definitions";
import { Column } from "./types";

interface TableBodyProps {
  authors: Author[];
  columns: Column[];
  currentPage: number;
  itemsPerPage: number;
}

export default function TableBody({
  authors,
  columns,
  currentPage,
  itemsPerPage,
}: TableBodyProps) {
  return (
    <tbody className="divide-y divide-zinc-300 bg-white">
      {authors.map((author, index) => (
        <tr
          key={author.id}
          className={`hover:bg-zinc-100 transition-colors ${
            index === 0 ? "rounded-t-lg" : ""
          } ${index === authors.length - 1 ? "rounded-b-lg" : ""}`}
        >
          {columns.map((column) => {
            const isActionsColumn = column.key === "actions";
            return (
              <td
                key={column.key}
                className={`px-3 py-4 text-sm ${
                  isActionsColumn ? "text-right" : ""
                } ${
                  column.key === "id"
                    ? "font-medium text-gray-900"
                    : column.key === "name"
                    ? "font-medium text-gray-900"
                    : "text-gray-500"
                }`}
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
