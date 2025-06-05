"use client";

import AuthorsState from "@/app/components/dashboard/authors/state/AuthorsState";
import AuthorsHeader from "@/app/components/dashboard/authors/header/AuthorsHeader";
import AuthorsSearch from "@/app/components/dashboard/authors/search/AuthorsSearch";
import AuthorsTable from "@/app/components/dashboard/authors/table/AuthorsTable";
import TableSkeleton from "@/app/components/dashboard/shared/table/TableSkeleton";
import { Author } from "@/app/lib/definition";

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

interface AuthorsStateProps {
  authors: Author[];
  totalPages: number;
  totalItems: number;
  isLoading: boolean;
  isDeleting: boolean;
  currentPage: number;
  itemsPerPage: number;
  sortField: keyof Author;
  sortDirection: "asc" | "desc";
  searchQuery: string;
  handlePageChange: (page: number) => void;
  handleSort: (field: keyof Author) => void;
  handleEdit: (author: Author) => void;
  handleDelete: (author: Author) => void;
  handleSearch: (term: string) => void;
  handleItemsPerPageChange: (limit: number) => void;
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
      }: AuthorsStateProps) => (
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
