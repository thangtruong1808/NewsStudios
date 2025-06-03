"use client";

import AuthorsState from "@/app/components/dashboard/authors/state/AuthorsState";
import AuthorsHeader from "@/app/components/dashboard/authors/header/AuthorsHeader";
import AuthorsSearch from "@/app/components/dashboard/authors/search/AuthorsSearch";
import AuthorsTable from "@/app/components/dashboard/authors/table/AuthorsTable";
import TableSkeleton from "@/app/components/dashboard/shared/table/TableSkeleton";

interface AuthorsPageProps {
  searchParams: {
    page?: string;
    search?: string;
    sortField?: string;
    sortDirection?: "asc" | "desc";
    query?: string;
    limit?: string;
  };
}

export default function AuthorsPage({ searchParams }: AuthorsPageProps) {
  return (
    <AuthorsState>
      {({
        authors,
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
        <div className="">
          <AuthorsHeader />

          <div className="mt-8">
            <AuthorsSearch onSearch={handleSearch} />
          </div>

          {isLoading ? (
            <TableSkeleton
              columns={[
                { field: "name", label: "Name" },
                { field: "description", label: "Description" },
                { field: "articles_count", label: "Articles" },
                { field: "bio", label: "Bio" },
                { field: "created_at", label: "Created At" },
                { field: "updated_at", label: "Updated At" },
              ]}
              itemsPerPage={itemsPerPage}
            />
          ) : (
            <AuthorsTable
              authors={authors}
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
          )}
        </div>
      )}
    </AuthorsState>
  );
}
