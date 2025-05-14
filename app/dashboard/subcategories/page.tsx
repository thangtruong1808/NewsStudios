"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  getSubcategories,
  searchSubcategories,
} from "@/app/lib/actions/subcategories";
import { SubCategory } from "@/app/lib/definition";
import SubcategoriesTable from "@/app/components/dashboard/subcategories/table/SubcategoriesTable";
import SubcategoriesSearch from "@/app/components/dashboard/subcategories/search/SubcategoriesSearch";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function SubcategoriesPage() {
  // Router and URL parameters
  const router = useRouter();
  const searchParams = useSearchParams();

  // State management for subcategories data and UI
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [sortField, setSortField] = useState<keyof SubCategory>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isDeleting, setIsDeleting] = useState(false);

  // Extract URL parameters
  const searchQuery = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  // Update items per page when limit changes
  useEffect(() => {
    setItemsPerPage(limit);
  }, [limit]);

  // Fetch subcategories data based on current filters and pagination
  useEffect(() => {
    const fetchSubcategories = async () => {
      setIsLoading(true);
      try {
        const result = searchQuery
          ? await searchSubcategories(searchQuery, page, itemsPerPage)
          : await getSubcategories(page, itemsPerPage);

        if (result.data) {
          setSubcategories(result.data);
          setTotalPages(Math.ceil(result.total / itemsPerPage));
          setTotalItems(result.total);
          setCurrentPage(page);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      } finally {
        setIsLoading(false);
        setIsSearching(false);
      }
    };

    fetchSubcategories();
  }, [page, searchQuery, sortField, sortDirection, itemsPerPage]);

  // Handle search input and update URL parameters
  const handleSearch = (query: string) => {
    setIsSearching(true);
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("search", query);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`/dashboard/subcategories?${params.toString()}`);
  };

  // Handle column sorting
  const handleSort = (field: keyof SubCategory) => {
    const newDirection =
      field === sortField && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
  };

  // Handle page navigation
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`/dashboard/subcategories?${params.toString()}`);
  };

  // Navigate to edit page for a subcategory
  const handleEdit = (subcategory: SubCategory) => {
    router.push(`/dashboard/subcategories/${subcategory.id}/edit`);
  };

  // Handle subcategory deletion (implemented in table component)
  const handleDelete = async (subcategory: SubCategory) => {
    // Delete functionality is handled in the table component
  };

  // Update items per page and reset to first page
  const handleItemsPerPageChange = (limit: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("limit", limit.toString());
    params.set("page", "1");
    router.push(`/dashboard/subcategories?${params.toString()}`);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Subcategories
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all subcategories in your account including their name,
            description, and associated category.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => router.push("/dashboard/subcategories/create")}
            className="block rounded-md bg-violet-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          >
            <PlusIcon className="h-5 w-5 inline-block mr-1" />
            Add Subcategory
          </button>
        </div>
      </div>

      <div className="mt-4">
        <SubcategoriesSearch onSearch={handleSearch} />
      </div>

      <div>
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
          isLoading={isLoading || isSearching}
          onSort={handleSort}
          onPageChange={handlePageChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
    </div>
  );
}
