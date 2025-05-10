"use client";

import { Author } from "../../../lib/definition";
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
    <tbody className="divide-y divide-gray-200 bg-white">
      {authors.map((author, index) => (
        <tr
          key={author.id}
          className="w-full border-b border-zinc-300 py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg hover:bg-zinc-100 transition-colors"
        >
          {columns.map((column) => {
            const isActionsColumn = column.key === "actions";
            const isMobileVisible = ["id", "name", "actions"].includes(
              column.key
            );

            return (
              <td
                key={`${author.id}-${column.key}`}
                className={`whitespace-nowrap ${
                  column.key === "sequence" ? "px-2 py-2" : "px-3 py-4"
                } text-sm ${isActionsColumn ? "" : "text-left"} ${
                  isMobileVisible ? "table-cell" : "hidden md:table-cell"
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
