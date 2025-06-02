"use client";

import UsersHeader from "@/app/components/dashboard/users/header/UsersHeader";
import UsersSearch from "@/app/components/dashboard/users/search/UsersSearch";
import UsersEmpty from "@/app/components/dashboard/users/empty/UsersEmpty";
import UsersTable from "@/app/components/dashboard/users/UsersTable";
import TableSkeleton from "@/app/components/dashboard/shared/table/TableSkeleton";
import { useUsers } from "@/app/components/dashboard/users/hooks/useUsers";

/**
 * Table column configuration for user data display
 * Defines the structure and behavior of each column in the users table
 */
const columns = [
  {
    field: "firstname",
    label: "First Name",
    sortable: true,
  },
  {
    field: "lastname",
    label: "Last Name",
    sortable: true,
  },
  {
    field: "email",
    label: "Email",
    sortable: true,
  },
  {
    field: "role",
    label: "Role",
    sortable: true,
  },
  {
    field: "status",
    label: "Status",
    sortable: true,
  },
  {
    field: "created_at",
    label: "Created At",
    sortable: true,
  },
  {
    field: "updated_at",
    label: "Updated At",
    sortable: true,
  },
];

/**
 * UsersPage Component
 * Main page for managing users with features for:
 * - Displaying user list with pagination and sorting
 * - Search functionality
 * - CRUD operations
 * - Loading states and empty states
 */
export default function UsersPage() {
  // Custom hook that manages all users data and operations
  const {
    users,
    isLoading,
    isDeleting,
    totalItems,
    totalPages,
    hasUsers,
    searchQuery,
    currentPage,
    itemsPerPage,
    sortField,
    sortDirection,
    handleSort,
    handlePageChange,
    handleEdit,
    handleDelete,
    handleItemsPerPageChange,
  } = useUsers();

  return (
    <div className="">
      {/* Header section with title and create button */}
      <UsersHeader />

      {/* Search functionality */}
      <UsersSearch />

      {/* Main content area with conditional rendering */}
      {isLoading ? (
        // Loading skeleton while data is being fetched
        <TableSkeleton columns={columns} itemsPerPage={itemsPerPage} />
      ) : hasUsers ? (
        // Users table with pagination and sorting
        <div className="flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <UsersTable
                users={users}
                searchQuery={searchQuery}
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
                sortField={sortField}
                sortDirection={sortDirection}
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
      ) : (
        // Empty state message when no users are found
        <UsersEmpty searchQuery={searchQuery} />
      )}
    </div>
  );
}
