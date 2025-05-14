"use client";

import { ViewProps } from "../TableTypes";
import TableHeader from "../TableHeader";
import TableRow from "../TableRow";

interface DesktopViewProps<T extends { id: number }> extends ViewProps<T> {
  currentPage?: number;
  itemsPerPage?: number;
}

/**
 * DesktopView component for displaying table data in a traditional table format
 * Used for medium and larger screens (md: breakpoint and up)
 */
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
}: DesktopViewProps<T>) {
  return (
    <div className="hidden lg:block">
      <table className="min-w-full divide-y divide-gray-300">
        <TableHeader columns={columns} />
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
                className="px-3 py-4 text-sm text-gray-500 text-center"
              >
                {searchQuery
                  ? "No items found matching your search criteria."
                  : "No items found."}
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
