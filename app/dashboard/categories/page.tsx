"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@/app/lib/definition";
import { getCategories, deleteCategory } from "@/app/lib/actions/categories";
import CategoriesTable from "@/app/components/dashboard/categories/table/CategoriesTable";
import CategoriesSearch from "@/app/components/dashboard/categories/search/CategoriesSearch";
import CategoriesHeader from "@/app/components/dashboard/categories/header/CategoriesHeader";
import TableSkeleton from "@/app/components/dashboard/shared/table/TableSkeleton";
import {
  showSuccessToast,
  showErrorToast,
  showConfirmationToast,
} from "@/app/components/dashboard/shared/toast/Toast";

/**
 * Props interface for CategoriesPage component
 * Defines the expected search parameters for filtering and sorting
 */
interface CategoriesPageProps {
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
 * CategoriesPage Component
 * Main page for managing categories with features for:
 * - Pagination and sorting
 * - Search functionality
 * - CRUD operations
 * - Loading states
 * - Error handling
 */
export default function CategoriesPage({ searchParams }: CategoriesPageProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isSorting, setIsSorting] = useState(false);

  // Extract and parse URL parameters for pagination and sorting
  const currentPage = Number(searchParams.page) || 1;
  const itemsPerPage = Number(searchParams.limit) || 5;
  const searchQuery = searchParams.query || "";
  const sortField = (searchParams.sortField as keyof Category) || "created_at";
  const sortDirection = searchParams.sortDirection || "desc";

  // Table column configuration for category data display
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
      field: "subcategories_count",
      label: "Subcategories",
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
   * Fetch categories data based on search and pagination parameters
   * Handles loading states and error cases
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isSearching && !isSorting) {
          setIsLoading(true);
        }
        const { data, totalItems, totalPages } = await getCategories({
          page: currentPage,
          limit: itemsPerPage,
          search: searchQuery,
          sortField: sortField as string,
          sortDirection,
        });

        setCategories(data || []);
        setTotalPages(totalPages);
        setTotalItems(totalItems);
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
    router.push(`/dashboard/categories?${params.toString()}`);
  };

  /**
   * Handle sorting - toggle sort direction and update URL
   * Manages sorting state and triggers data refresh
   */
  const handleSort = (field: keyof Category) => {
    setIsSorting(true);
    const newDirection =
      field === sortField && sortDirection === "asc" ? "desc" : "asc";
    const params = new URLSearchParams(searchParams);
    params.set("sortField", field as string);
    params.set("sortDirection", newDirection);
    router.push(`/dashboard/categories?${params.toString()}`);
  };

  /**
   * Navigate to category edit page
   * Routes to the edit form for the selected category
   */
  const handleEdit = (category: Category) => {
    router.push(`/dashboard/categories/${category.id}/edit`);
  };

  /**
   * Handle category deletion with confirmation
   * Includes error handling and state management
   */
  const handleDelete = async (category: Category) => {
    const confirmPromise = new Promise<boolean>((resolve) => {
      showConfirmationToast({
        title: "Delete Category",
        message:
          "Are you sure you want to delete this category? This action cannot be undone.",
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });

    const isConfirmed = await confirmPromise;
    if (!isConfirmed) return;

    setIsDeleting(true);
    try {
      const { error } = await deleteCategory(category.id);

      if (error) {
        showErrorToast({ message: error });
        return;
      }

      // Refresh the categories data
      const { data, totalItems, totalPages } = await getCategories({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
        sortField: sortField as string,
        sortDirection,
      });

      setCategories(data || []);
      setTotalPages(totalPages);
      setTotalItems(totalItems);

      router.refresh();
      showSuccessToast({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting category:", error);
      showErrorToast({
        message: "Failed to delete category. Please try again.",
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
    router.push(`/dashboard/categories?${params.toString()}`);
  };

  /**
   * Update items per page and reset to first page
   * Manages pagination size and triggers data refresh
   */
  const handleItemsPerPageChange = (limit: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.set("limit", limit.toString());
    router.push(`/dashboard/categories?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header section with title and create button */}
      <CategoriesHeader />

      {/* Search functionality */}
      <CategoriesSearch onSearch={handleSearch} />

      {/* Main content area */}
      {isLoading ? (
        <TableSkeleton columns={columns} itemsPerPage={itemsPerPage} />
      ) : (
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
      )}
    </div>
  );
}
