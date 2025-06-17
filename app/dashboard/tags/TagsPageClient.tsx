"use client";

import TagsTable from "@/app/components/dashboard/tags/table/TagsTable";
import TagsSearchWrapper from "@/app/components/dashboard/tags/search/TagsSearchWrapper";
import TableSkeleton from "@/app/components/dashboard/shared/table/TableSkeleton";
import TagsHeader from "@/app/components/dashboard/tags/header/TagsHeader";
import TagsState from "@/app/components/dashboard/tags/state/TagsState";
import { formatDateToLocal } from "@/app/lib/utils/dateFormatter";

/**
 * Props interface for TagsPageClient component
 * Defines the expected search parameters for filtering and sorting
 */
interface TagsPageClientProps {
  searchParams?: {
    page?: string;
    search?: string;
    sortField?: string;
    sortDirection?: "asc" | "desc";
    query?: string;
    limit?: string;
  };
}

/**
 * TagsPageClient Component
 * Main page for managing tags with features for:
 * - Pagination and sorting
 * - Search functionality
 * - CRUD operations
 * - Loading states
 * - Error handling
 */
export default function TagsPageClient({ searchParams }: TagsPageClientProps = {}) {
  // Table column configuration for tag data display
  const columns = [
    {
      field: "name",
      label: "Name",
      sortable: true,
    },
    {
      field: "description",
      label: "Description",
      sortable: true,
    },
    {
      field: "created_at",
      label: "Created At",
      sortable: true,
      render: (value: string) => formatDateToLocal(value),
    },
    {
      field: "updated_at",
      label: "Updated At",
      sortable: true,
      render: (value: string) => formatDateToLocal(value),
    },
  ];

  return (
    <TagsState>
      {({
        tags,
        totalPages,
        totalItems,
        isLoading,
        isDeleting,
        currentPage,
        itemsPerPage,
        sortField,
        sortDirection,
        searchQuery,
        handlePageChange,
        handleSort,
        handleEdit,
        handleDelete,
        handleSearch,
        handleItemsPerPageChange,
      }) => (
        <div className="bg-gray-50">
          {/* Header section with title and create button */}
          <TagsHeader />

          {/* Search functionality */}
          <div className="my-6">
            <div className="w-full">
              <TagsSearchWrapper onSearch={handleSearch} />
            </div>
          </div>

          {/* Main content area */}
          {isLoading ? (
            <TableSkeleton columns={columns} itemsPerPage={itemsPerPage} />
          ) : (
            <div className="flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <TagsTable
                    tags={tags}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    totalItems={totalItems}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    searchQuery={searchQuery}
                    isDeleting={isDeleting}
                    isLoading={isLoading}
                    onSort={handleSort}
                    onPageChange={handlePageChange}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onItemsPerPageChange={handleItemsPerPageChange}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </TagsState>
  );
} 