"use client";

import { TableBodyProps } from "./types";

export default function TableBody({
  tags,
  columns,
  currentPage,
  itemsPerPage,
}: TableBodyProps) {
  return (
    <tbody className="bg-white">
      {tags.map((tag, index) => (
        <tr
          key={tag.id}
          className="w-full border-b border-zinc-300 px-3 py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg hover:bg-zinc-100 transition-colors"
        >
          {columns.map((column) => (
            <td
              key={column.key}
              className={`whitespace-nowrap px-3 py-3 ${
                column.key === "actions" ? "text-center" : ""
              }`}
            >
              {column.cell(tag, index, currentPage, itemsPerPage)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
