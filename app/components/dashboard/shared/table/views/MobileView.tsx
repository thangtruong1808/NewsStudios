"use client";

import { ViewProps } from "../TableTypes";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface MobileViewProps<T extends { id: number }> extends ViewProps<T> {
  currentPage?: number;
  itemsPerPage?: number;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  isDeleting?: boolean;
}

export default function MobileView<T extends { id: number }>({
  data,
  columns,
  isLoading,
  searchQuery,
  currentPage = 1,
  itemsPerPage = 10,
  onEdit,
  onDelete,
  isDeleting,
}: MobileViewProps<T>) {
  // Filter out the actions column
  const displayColumns = columns.filter((column) => column.field !== "actions");

  return (
    <div className="sm:hidden">
      <div className="space-y-4">
        {isLoading ? (
          // Show loading state
          [...Array(5)].map((_, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow animate-pulse"
            >
              {displayColumns.map((column, colIndex) => (
                <div key={colIndex} className="flex items-center mb-2">
                  <div className="w-1/3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div className="w-2/3">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : data.length === 0 ? (
          <div className="text-center py-4 text-sm text-gray-500">
            {searchQuery
              ? "No items found matching your search criteria."
              : "No items found."}
          </div>
        ) : (
          data.map((item, index) => {
            const sequence = (currentPage - 1) * itemsPerPage + index + 1;
            return (
              <div
                key={item.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="space-y-2">
                  {displayColumns.map((column) => (
                    <div
                      key={String(column.field)}
                      className="flex items-start"
                    >
                      <div className="w-1/3 font-medium text-gray-900 text-xs">
                        {column.label}:
                      </div>
                      <div className="w-2/3 text-gray-500 text-xs">
                        {column.field === "sequence"
                          ? sequence
                          : column.render
                          ? column.render(
                              item[column.field as keyof T] as string,
                              item
                            )
                          : String(item[column.field as keyof T])}
                      </div>
                    </div>
                  ))}
                  {(onEdit || onDelete) && (
                    <div className="flex justify-start space-x-2 pt-2 border-t">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="inline-flex items-center gap-1 rounded border border-blue-500 px-2.5 py-1 text-xs font-medium text-blue-500 hover:bg-blue-50 transition-colors duration-200"
                        >
                          <PencilIcon className="h-3.5 w-3.5" />
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item)}
                          disabled={isDeleting}
                          className="inline-flex items-center gap-1 rounded border border-red-500 px-2.5 py-1 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
                        >
                          <TrashIcon className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
