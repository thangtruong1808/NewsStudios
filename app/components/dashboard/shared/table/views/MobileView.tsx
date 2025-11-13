"use client";

import { ViewProps } from "../TableTypes";
import {
  PencilIcon,
  TrashIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";

/* eslint-disable no-unused-vars */
interface MobileViewProps<T extends { id: number }> extends ViewProps<T> {
  currentPage?: number;
  itemsPerPage?: number;
  onEdit?: ({ item }: { item: T }) => void;
  onDelete?: ({ item }: { item: T }) => void;
  isDeleting?: boolean;
}
/* eslint-enable no-unused-vars */

// Description: Render mobile card layout for table data with admin action controls.
// Data created: 2024-11-13
// Author: thangtruong
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
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  // Filter out the actions column
  const displayColumns = columns.filter((column) => column.field !== "actions");

  return (
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
        <div className="rounded-md bg-gray-50 p-6 text-center">
          <div className="flex flex-col items-center justify-center space-y-3">
            <DocumentIcon className="h-12 w-12 text-red-400" />
            <p className="text-sm text-red-500">
              {searchQuery
                ? "No items found matching your search criteria."
                : "No items found from the database."}
            </p>
          </div>
        </div>
      ) : (
        data.map((item, index) => {
          const sequence = (currentPage - 1) * itemsPerPage + index + 1;
          return (
            <div
              key={item.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow hover:bg-gray-100"
            >
              <div className="space-y-2">
                {displayColumns.map((column) => {
                  const rawValue =
                    column.field === "sequence"
                      ? String(sequence)
                      : item[column.field as keyof T];

                  return (
                    <div key={String(column.field)} className="flex items-start">
                      <div className="w-1/3 font-medium text-xs">
                        {column.label}:
                      </div>
                      <div className="w-2/3 text-xs">
                        {column.render
                          ? column.render({
                              value: rawValue as T[keyof T],
                              row: item,
                            })
                          : String(rawValue)}
                      </div>
                    </div>
                  );
                })}
                {isAdmin && (onEdit || onDelete) && (
                  <div className="flex justify-start space-x-2 pt-2 border-t">
                    {onEdit && (
                      <button
                        onClick={() => onEdit({ item })}
                        className="inline-flex items-center gap-1 rounded border border-blue-500 px-2.5 py-1 text-xs font-medium text-blue-500 hover:bg-blue-50 transition-colors duration-200"
                      >
                        <PencilIcon className="h-3.5 w-3.5" />
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete({ item })}
                        disabled={isDeleting}
                        className="inline-flex items-center gap-1 rounded border border-red-500 px-2.5 py-1 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors duración-200 disabled:opacity-50"
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
  );
}
