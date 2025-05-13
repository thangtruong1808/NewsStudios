"use client";

import { TableProps } from "../TableTypes";

/**
 * DesktopView component for displaying table data in a traditional table format
 * Used for medium and larger screens (md: breakpoint and up)
 */
export default function DesktopView<T extends { id: number }>({
  data,
  columns,
  currentPage = 1,
  itemsPerPage = 10,
  onEdit,
  onDelete,
  isDeleting,
}: TableProps<T>) {
  return (
    <div className="hidden md:block">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                {/* Sequence column */}
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  #
                </th>

                {/* Dynamic column headers */}
                {columns.map((column) => (
                  <th
                    key={String(column.field)}
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {data.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {/* Sequence number cell */}
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>

                  {/* Dynamic data cells */}
                  {columns.map((column) => (
                    <td
                      key={String(column.field)}
                      className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                    >
                      {column.render
                        ? column.render(
                            item[column.field as keyof T] as string,
                            item
                          )
                        : String(item[column.field as keyof T])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
