"use client";

import SubcategoriesState from "@/app/components/dashboard/subcategories/state/SubcategoriesState";
import SubcategoriesHeader from "@/app/components/dashboard/subcategories/header/SubcategoriesHeader";
import SubcategoriesSearch from "@/app/components/dashboard/subcategories/search/SubcategoriesSearch";
import SubcategoriesTable from "@/app/components/dashboard/subcategories/table/SubcategoriesTable";
import TableSkeleton from "@/app/components/dashboard/shared/table/TableSkeleton";
import { getTableColumns } from "@/app/components/dashboard/subcategories/table/TableColumns";

export default function SubcategoriesPage() {
  return (
    <SubcategoriesState>
      {({
        subcategories,
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
          <SubcategoriesHeader />

          {/* Search functionality */}
          <div className="my-6">
            <div className="w-full">
              <SubcategoriesSearch onSearch={handleSearch} />
            </div>
          </div>

          {/* Main content area */}
          {isLoading ? (
            <TableSkeleton
              columns={getTableColumns()}
              itemsPerPage={itemsPerPage}
            />
          ) : (
            <div className="flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <SubcategoriesTable
                    subcategories={subcategories}
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
    </SubcategoriesState>
  );
}
