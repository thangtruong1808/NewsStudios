"use client";

import { Column } from "./TableTypes";

interface TableBodyProps<T extends { id: number }> {
  data: T[];
  columns: Column<T>[];
  currentPage?: number;
  itemsPerPage?: number;
}

// Description: Render table body rows with sequence numbers and flexible column renderers.
// Data created: 2024-11-13
// Author: thangtruong
export default function TableBody<T extends { id: number }>({
  data,
  columns,
  currentPage = 1,
  itemsPerPage = 10,
}: TableBodyProps<T>) {
  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {data.map((item, index) => (
        <tr key={item.id} className="hover:bg-gray-50">
          <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
            {(currentPage - 1) * itemsPerPage + index + 1}
          </td>
          {columns.map((column) => {
            const rawValue = item[column.field as keyof T];

            return (
              <td
                key={String(column.field)}
                className={`px-3 py-4 text-sm text-gray-500 ${
                  column.field === "actions" ? "text-left" : ""
                }`}
              >
                <div className="flex justify-start items-start">
                  {column.render
                    ? column.render({
                        value: rawValue as T[keyof T],
                        row: item,
                      })
                    : String(rawValue)}
                </div>
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
}
