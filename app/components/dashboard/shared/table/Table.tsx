"use client";

import { TableProps } from "./TableTypes";
import DesktopView from "./views/DesktopView";
import TabletView from "./views/TabletView";
import MobileView from "./views/MobileView";
import Pagination from "./Pagination";
import EntriesSelector from "./EntriesSelector";

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
        <EntriesSelector
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          currentPage={currentPage}
          onItemsPerPageChange={onItemsPerPageChange}
        />
      )}

      {/* Desktop View (lg and above) */}
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

      {/* Tablet View (sm to lg) */}
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

      {/* Mobile View (below sm) */}
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

      {/* Pagination - only show if there are items */}
      {hasItems &&
        totalPages &&
        totalPages > 1 &&
        onPageChange &&
        totalItems && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
        )}
    </div>
  );
}
