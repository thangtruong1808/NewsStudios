"use client";

import { TableProps } from "./TableTypes";
import DesktopView from "./views/DesktopView";
import TabletView from "./views/TabletView";
import MobileView from "./views/MobileView";
import Pagination from "./Pagination";
import EntriesSelector from "./EntriesSelector";

// Description: Render a responsive dashboard table with pagination and adaptive layouts.
// Data created: 2024-11-13
// Author: thangtruong
export default function Table<T extends { id: number }>({
  data,
  columns,
  currentPage = 1,
  itemsPerPage = 10,
  onEdit,
  onDelete,
  isDeleting,
  isLoading,
  searchQuery,
  onPageChange,
  totalPages,
  totalItems,
  onItemsPerPageChange,
  sortField,
  sortDirection,
  onSort,
}: TableProps<T>) {
  // Only show entries selector and pagination if there are items
  const hasItems = data.length > 0;

  return (
    <div className="space-y-4">
      {hasItems && onItemsPerPageChange && totalItems && (
        <div className="px-4 sm:px-6 lg:px-8">
          <EntriesSelector
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            currentPage={currentPage}
            onItemsPerPageChange={(limit) =>
              onItemsPerPageChange({ limit })
            }
          />
        </div>
      )}

      {/* Desktop View (lg and above) */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
              <DesktopView
                data={data}
                columns={columns}
                onEdit={onEdit}
                onDelete={onDelete}
                isDeleting={isDeleting}
                isLoading={isLoading}
                searchQuery={searchQuery}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={onSort}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tablet View (sm to lg) */}
      <div className="hidden sm:block lg:hidden">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
              <TabletView
                data={data}
                columns={columns}
                onEdit={onEdit}
                onDelete={onDelete}
                isDeleting={isDeleting}
                isLoading={isLoading}
                searchQuery={searchQuery}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View (below sm) */}
      <div className="sm:hidden">
        <div className="px-4 sm:px-6 lg:px-8">
          <MobileView
            data={data}
            columns={columns}
            onEdit={onEdit}
            onDelete={onDelete}
            isDeleting={isDeleting}
            isLoading={isLoading}
            searchQuery={searchQuery}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>

      {/* Pagination - only show if there are items */}
      {hasItems &&
        totalPages &&
        totalPages > 1 &&
        onPageChange &&
        totalItems && (
          <div className="px-4 sm:px-6 lg:px-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
                onPageChange={(page) => onPageChange({ page })}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}
    </div>
  );
}
