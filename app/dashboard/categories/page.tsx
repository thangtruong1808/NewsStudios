"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@/app/lib/definition";
import { getCategories } from "@/app/lib/actions/categories";
import CategoriesTable from "@/app/components/dashboard/categories/table/CategoriesTable";
import CategoriesSearch from "@/app/components/dashboard/categories/search/CategoriesSearch";
import CategoriesHeader from "@/app/components/dashboard/categories/header/CategoriesHeader";

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

export default function CategoriesPage({ searchParams }: CategoriesPageProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isSorting, setIsSorting] = useState(false);

  const currentPage = Number(searchParams.page) || 1;
  const itemsPerPage = Number(searchParams.limit) || 5;
  const searchQuery = searchParams.query || "";
  const sortField = (searchParams.sortField as keyof Category) || "created_at";
  const sortDirection = searchParams.sortDirection || "desc";

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

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/dashboard/categories?${params.toString()}`);
  };

  const handleSort = (field: keyof Category) => {
    setIsSorting(true);
    const newDirection =
      field === sortField && sortDirection === "asc" ? "desc" : "asc";
    const params = new URLSearchParams(searchParams);
    params.set("sortField", field as string);
    params.set("sortDirection", newDirection);
    router.push(`/dashboard/categories?${params.toString()}`);
  };

  const handleEdit = (category: Category) => {
    router.push(`/dashboard/categories/${category.id}/edit`);
  };

  const handleDelete = async (category: Category) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setIsDeleting(true);
      try {
        const response = await fetch(`/api/categories/${category.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete category");
        }

        router.refresh();
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Failed to delete category. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

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

  const handleItemsPerPageChange = (limit: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.set("limit", limit.toString());
    router.push(`/dashboard/categories?${params.toString()}`);
  };

  if (isLoading && !isSearching && !isSorting) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <CategoriesHeader />

      {/* Search Bar */}
      <div className="mt-4">
        <CategoriesSearch onSearch={handleSearch} />
      </div>

      <div className="flow-root mt-6">
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
              onSort={handleSort}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeleting={isDeleting}
              searchQuery={searchQuery}
              isLoading={isSearching || isSorting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
