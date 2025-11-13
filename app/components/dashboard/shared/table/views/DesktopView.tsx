"use client";

import { ViewProps } from "../TableTypes";
import TableHeader from "../TableHeader";
import TableRow from "../TableRow";
import { DocumentIcon } from "@heroicons/react/24/outline";

/* eslint-disable no-unused-vars */
interface DesktopViewProps<T extends { id: number }> extends ViewProps<T> {
  currentPage?: number;
  itemsPerPage?: number;
  sortField?: keyof T;
  sortDirection?: "asc" | "desc";
  onSort?: ({ field }: { field: keyof T }) => void;
}
/* eslint-enable no-unused-vars */

// Description: Render desktop table layout with skeleton, empty states, and sequence-aware rows.
// Data created: 2024-11-13
// Author: thangtruong
export default function DesktopView<T extends { id: number }>({
  data,
  columns,
  onEdit,
  onDelete,
  isDeleting,
  isLoading,
  searchQuery,
  currentPage = 1,
  itemsPerPage = 10,
  sortField,
  sortDirection,
  onSort,
}: DesktopViewProps<T>) {
  return (
    <div className="hidden lg:block">
      <table className="min-w-full divide-y divide-gray-300">
        <TableHeader
          columns={columns}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={onSort}
        />
        <tbody className="divide-y divide-gray-200 bg-white">
          {isLoading ? (
            // Show loading state for table rows
            [...Array(5)].map((_, index) => (
              <tr key={index} className="animate-pulse">
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                  >
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="rounded-md bg-gray-50 p-6 text-center"
              >
                <div className="flex flex-col items-center justify-center space-y-3">
                  <DocumentIcon className="h-12 w-12 text-red-400" />
                  <p className="text-sm text-red-500">
                    {searchQuery
                      ? "No items found matching your search criteria."
                      : "No items found from the database."}
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <TableRow
                key={item.id}
                item={item}
                columns={columns}
                onEdit={onEdit}
                onDelete={onDelete}
                isDeleting={isDeleting}
                index={index}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
