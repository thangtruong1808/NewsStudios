"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getSubcategories,
  searchSubcategories,
  deleteSubcategory,
} from "@/app/lib/actions/subcategories";
import { SubCategory } from "@/app/lib/definition";
import SubcategoriesTable from "@/app/components/dashboard/subcategories/table/SubcategoriesTable";
import SubcategoriesSearch from "@/app/components/dashboard/subcategories/search/SubcategoriesSearch";
import { PlusIcon } from "@heroicons/react/24/outline";
import TableSkeleton from "@/app/components/dashboard/shared/table/TableSkeleton";
import SubcategoriesHeader from "@/app/components/dashboard/subcategories/header/SubcategoriesHeader";
import Link from "next/link";
import {
  showSuccessToast,
  showErrorToast,
  showConfirmationToast,
} from "@/app/components/dashboard/shared/toast/Toast";

/**
 * Props interface for SubcategoriesPage component
 * Defines the expected search parameters for filtering and sorting
 */
interface SubcategoriesPageProps {
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
 * SubcategoriesPage Component
 * Main page for managing subcategories with features for:
 * - Pagination and sorting
 * - Search functionality
 * - CRUD operations
 * - Loading states
 * - Error handling
 */
export default function SubcategoriesPage({
  searchParams,
}: SubcategoriesPageProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isSorting, setIsSorting] = useState(false);

  // Extract and parse URL parameters for pagination and sorting
  const currentPage = Number(searchParams.page) || 1;
  const itemsPerPage = Number(searchParams.limit) || 5;
  const searchQuery = searchParams.query || "";
  const sortField =
    (searchParams.sortField as keyof SubCategory) || "created_at";
  const sortDirection = searchParams.sortDirection || "desc";

  // Table column configuration for subcategory data display
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
      field: "category_name",
      label: "Category",
      sortable: true,
    },
    {
      field: "articles_count",
      label: "Articles",
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
   * Fetch subcategories data based on search and pagination parameters
   * Handles loading states and error cases
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isSearching && !isSorting) {
          setIsLoading(true);
        }
        const result = searchQuery
          ? await searchSubcategories(searchQuery, currentPage, itemsPerPage)
          : await getSubcategories(currentPage, itemsPerPage);

        setSubcategories(result.data || []);
        if (result.total !== undefined) {
          setTotalPages(Math.ceil(result.total / itemsPerPage));
          setTotalItems(result.total);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
        setIsSearching(false);
        setIsSorting(false);
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage, sortField, sortDirection, searchQuery]);

  /**
   * Handle pagination - navigate to selected page
   * Updates URL parameters and triggers data fetch
   */
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/dashboard/subcategories?${params.toString()}`);
  };

  /**
   * Handle sorting - toggle sort direction and update URL
   * Manages sorting state and triggers data refresh
   */
  const handleSort = (field: keyof SubCategory) => {
    setIsSorting(true);
    const newDirection =
      field === sortField && sortDirection === "asc" ? "desc" : "asc";
    const params = new URLSearchParams(searchParams);
    params.set("sortField", field as string);
    params.set("sortDirection", newDirection);
    router.push(`/dashboard/subcategories?${params.toString()}`);
  };

  /**
   * Navigate to subcategory edit page
   * Routes to the edit form for the selected subcategory
   */
  const handleEdit = (subcategory: SubCategory) => {
    router.push(`/dashboard/subcategories/${subcategory.id}/edit`);
  };

  /**
   * Handle subcategory deletion with confirmation
   * Includes error handling and state management
   */
  const handleDelete = async (subcategory: SubCategory) => {
    const confirmPromise = new Promise<boolean>((resolve) => {
      showConfirmationToast({
        title: "Delete Subcategory",
        message:
          "Are you sure you want to delete this subcategory? This action cannot be undone.",
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });

    const isConfirmed = await confirmPromise;
    if (!isConfirmed) return;

    setIsDeleting(true);
    try {
      const { success, error } = await deleteSubcategory(subcategory.id);

      if (!success) {
        throw new Error(error || "Failed to delete subcategory");
      }

      // Refresh the data after successful deletion
      const result = searchQuery
        ? await searchSubcategories(searchQuery, currentPage, itemsPerPage)
        : await getSubcategories(currentPage, itemsPerPage);

      setSubcategories(result.data || []);
      if (result.total !== undefined) {
        setTotalPages(Math.ceil(result.total / itemsPerPage));
        setTotalItems(result.total);
      }

      showSuccessToast({ message: "Subcategory deleted successfully" });
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      showErrorToast({
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete subcategory. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Handle search functionality
   * Updates URL parameters and triggers data refresh
   */
  const handleSearch = (term: string) => {
    setIsSearching(true);
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    router.push(`/dashboard/subcategories?${params.toString()}`);
  };

  /**
   * Update items per page and reset to first page
   * Manages pagination size and triggers data refresh
   */
  const handleItemsPerPageChange = (limit: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.set("limit", limit.toString());
    router.push(`/dashboard/subcategories?${params.toString()}`);
  };

  return (
    <div className="">
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
        <TableSkeleton columns={columns} itemsPerPage={itemsPerPage} />
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
  );
}
