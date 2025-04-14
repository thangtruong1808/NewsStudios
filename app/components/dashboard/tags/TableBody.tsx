"use client";

import { TableBodyProps } from "./types";

export default function TableBody({
  tags,
  columns,
  currentPage,
  itemsPerPage,
}: TableBodyProps) {
  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {tags.map((tag, index) => (
        <tr
          key={tag.id}
          className={`${
            index % 2 === 0 ? "bg-white" : "bg-gray-50"
          } hover:bg-gray-100 transition-colors duration-150`}
        >
          {columns.map((column) => (
            <td
              key={column.key}
              className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
            >
              {column.cell(tag, index, currentPage, itemsPerPage)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
