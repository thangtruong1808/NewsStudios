"use client";

import { Table } from "@/app/components/dashboard/shared/table";
import { SearchWrapper } from "@/app/components/dashboard/shared/search";
import TableSkeleton from "@/app/components/dashboard/shared/table/TableSkeleton";
import ArticlesHeader from "@/app/components/dashboard/articles/header/ArticlesHeader";
import { getArticlesTableColumns } from "@/app/components/dashboard/articles/table/ArticlesTableColumns";
import { useArticles } from "@/app/components/dashboard/articles/hooks/useArticles";

/**
 * Props interface for the Articles page component
 */
interface ArticlesPageProps {
  searchParams: {
    page?: string;
    search?: string;
    sortField?: string;
    sortDirection?: "asc" | "desc";
    query?: string;
    limit?: string;
  };
}

/**
 * ArticlesPage Component
 * Main page for managing articles with features for:
 * - Pagination and sorting
 * - Search functionality
 * - CRUD operations
 * - Loading states
 * - Error handling
 */
export default function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const {
    articles,
    totalPages,
    totalItems,
    currentPage,
    itemsPerPage,
    sortField,
    sortDirection,
    searchQuery,
    isDeleting,
    isLoading,
    isSearching,
    isSorting,
    handlePageChange,
    handleSort,
    handleEdit,
    handleDelete,
    handleSearch,
    handleItemsPerPageChange,
  } = useArticles();

  // Get table columns configuration
  const columns = getArticlesTableColumns({
    isDeleting,
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  // Loading state with skeleton UI
  if (isLoading && !isSearching && !isSorting) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <ArticlesHeader />
        <div className="mt-8">
          <div className="w-full">
            <SearchWrapper
              placeholder="Search articles by title, content, or category..."
              onSearch={handleSearch}
            />
          </div>
        </div>
        <TableSkeleton columns={columns} itemsPerPage={itemsPerPage} />
      </div>
    );
  }

  // Main render with full table functionality
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <ArticlesHeader />

      <div className="my-6">
        <div className="w-full">
          <SearchWrapper
            placeholder="Search articles by title, content, or category..."
            onSearch={handleSearch}
          />
        </div>
      </div>

      <div className="flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <Table
              data={articles}
              columns={columns}
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              onPageChange={handlePageChange}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeleting={isDeleting}
              searchQuery={searchQuery}
              isLoading={isSearching || isSorting}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
