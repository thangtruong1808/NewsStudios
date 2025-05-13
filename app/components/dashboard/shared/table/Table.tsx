"use client";

import { TableProps, Column } from "./TableTypes";
import TableHeader from "./TableHeader";
import TablePagination from "./TablePagination";
import TableRow from "./TableRow";

export default function Table<T extends { id: number }>({
  data,
  columns,
  currentPage = 1,
  totalPages = 1,
  itemsPerPage = 10,
  totalItems = 0,
  sortField,
  sortDirection,
  onSort,
  onPageChange,
  onEdit,
  onDelete,
  isDeleting = false,
  searchQuery = "",
  isLoading = false,
}: TableProps<T>) {
  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
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
                  [...Array(itemsPerPage)].map((_, index) => (
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
                        ? "No articles found matching your search criteria."
                        : "No articles found."}
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
          <div className="mt-4">
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
