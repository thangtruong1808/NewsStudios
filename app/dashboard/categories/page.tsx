"use client";

import CategoriesState from "@/app/components/dashboard/categories/state/CategoriesState";
import CategoriesHeader from "@/app/components/dashboard/categories/header/CategoriesHeader";
import CategoriesSearch from "@/app/components/dashboard/categories/search/CategoriesSearch";
import { CategoriesTable } from "@/app/components/dashboard/categories/table/CategoriesTable";
import TableSkeleton from "@/app/components/dashboard/shared/table/TableSkeleton";
import { Category } from "@/app/lib/definition";

export default function CategoriesPage() {
  return (
    <CategoriesState>
      {({
        categories,
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
          <CategoriesHeader />

          {/* Search functionality */}
          <div className="my-6">
            <div className="w-full">
              <CategoriesSearch onSearch={handleSearch} />
            </div>
          </div>

          {/* Main content area */}
          {isLoading ? (
            <TableSkeleton
              columns={[
                { field: "name", label: "Name", sortable: true },
                { field: "description", label: "Description", sortable: true },
                {
                  field: "subcategories_count",
                  label: "Subcategories",
                  sortable: true,
                },
                { field: "articles_count", label: "Articles", sortable: true },
                { field: "created_at", label: "Created At", sortable: true },
                { field: "updated_at", label: "Updated At", sortable: true },
              ]}
              itemsPerPage={itemsPerPage}
            />
          ) : (
            <div className="flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <CategoriesTable
                    categories={categories}
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
    </CategoriesState>
  );
}
