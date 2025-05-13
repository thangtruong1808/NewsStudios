"use client";

import { TableProps } from "../TableTypes";

export default function MobileView<T extends { id: number }>({
  data,
  columns,
  currentPage = 1,
  itemsPerPage = 10,
  onEdit,
  onDelete,
  isDeleting,
}: TableProps<T>) {
  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div
          key={item.id}
          className="bg-white p-4 rounded-lg shadow-sm border border-zinc-200"
        >
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-zinc-500">
                #{(currentPage - 1) * itemsPerPage + index + 1}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {columns.map((column) => {
                if (column.field === "actions") {
                  return (
                    <div key={String(column.field)} className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {column.label}
                      </span>
                      <div className="flex space-x-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item.id)}
                            className="inline-flex items-center gap-1 rounded border border-blue-500 px-3 py-1.5 text-sm font-medium text-blue-500 hover:bg-blue-50 transition-colors duration-200"
                          >
                            Edit
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item.id)}
                            disabled={isDeleting}
                            className="inline-flex items-center gap-1 rounded border border-red-500 px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={String(column.field)} className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {column.label}
                    </span>
                    <span className="text-sm text-zinc-500">
                      {column.render
                        ? column.render(item[column.field], item)
                        : String(item[column.field])}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
