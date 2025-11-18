"use client";

import { Table } from "@/app/components/dashboard/shared/table";
import { SearchWrapper } from "@/app/components/dashboard/shared/search";
import TableSkeleton from "@/app/components/dashboard/shared/table/TableSkeleton";
import ArticlesHeader from "@/app/components/dashboard/articles/header/ArticlesHeader";
import { getArticlesTableColumns } from "@/app/components/dashboard/articles/table/ArticlesTableColumns";
import { useArticles } from "@/app/components/dashboard/articles/hooks/useArticles";
import { useSession } from "next-auth/react";
import type { Article } from "@/app/lib/definition";

/**
 * Props interface for the Articles page component
 */
// Component Info
// Description: Dashboard page listing articles with search, sorting, and admin actions.
// Date created: 2025-11-18
// Author: thangtruong
export default function ArticlesPageClient() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

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
    isAdmin,
  });
  const augmentedArticles = articles.map((article, index) => ({
    ...article,
    sequence: (currentPage - 1) * itemsPerPage + index + 1,
  }));

  // Loading state with skeleton UI
  if (isLoading && !isSearching && !isSorting) {
    return (
      <div className="bg-gray-50">
        <ArticlesHeader />
        <div className="my-6">
          <div className="w-full">
            <SearchWrapper
              placeholder="Search articles by title, content, or category . . ."
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
    <div className="bg-gray-50">
      <ArticlesHeader />

      <div className="my-6">
        <div className="w-full">
          <SearchWrapper
            placeholder="Search articles by title and content ..."
            onSearch={handleSearch}
          />
        </div>
      </div>

      <div className="flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <Table
              data={augmentedArticles}
              columns={columns}
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={({ field }) => {
                if (field === "sequence") return;
                handleSort(field as keyof Article);
              }}
              onPageChange={({ page }) => handlePageChange(page)}
              onEdit={({ item }) => handleEdit(item)}
              onDelete={({ item }) => handleDelete(item)}
              isDeleting={isDeleting}
              searchQuery={searchQuery}
              isLoading={isSearching || isSorting}
              onItemsPerPageChange={({ limit }) =>
                handleItemsPerPageChange(limit)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
} 