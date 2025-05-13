"use client";

import { TableProps } from "./TableTypes";

export default function TableBody<T extends { id: number }>({
  data,
  columns,
  currentPage = 1,
  itemsPerPage = 10,
  onEdit,
  onDelete,
  isDeleting,
}: TableProps<T>) {
  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {data.map((item, index) => (
        <tr key={item.id} className="hover:bg-gray-50">
          <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
            {(currentPage - 1) * itemsPerPage + index + 1}
          </td>
          {columns.map((column) => (
            <td
              key={String(column.field)}
              className={`px-3 py-4 text-sm text-gray-500 ${
                column.field === "actions" ? "text-left" : ""
              }`}
            >
              <div className="flex justify-start items-start">
                {column.render
                  ? column.render(item[column.field], item)
                  : String(item[column.field])}
              </div>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
