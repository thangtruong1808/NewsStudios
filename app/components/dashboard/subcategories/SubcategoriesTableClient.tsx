"use client";

import { useState, useEffect } from "react";
import { Subcategory } from "../../../type/definitions";
import { getTableColumns } from "./TableColumns";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import Pagination from "./Pagination";
import { toast } from "react-hot-toast";
import { deleteSubcategory } from "../../../lib/actions/subcategories";
import { useRouter } from "next/navigation";
import Search from "../search";

interface SubcategoriesTableClientProps {
  subcategories: Subcategory[];
}

export default function SubcategoriesTableClient({
  subcategories,
}: SubcategoriesTableClientProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Subcategory>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSubcategories, setFilteredSubcategories] =
    useState<Subcategory[]>(subcategories);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredSubcategories.length / itemsPerPage);

  // Filter subcategories based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSubcategories(subcategories);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = subcategories.filter(
        (subcategory) =>
          subcategory.name.toLowerCase().includes(query) ||
          (subcategory.description &&
            subcategory.description.toLowerCase().includes(query)) ||
          (subcategory.category_name &&
            subcategory.category_name.toLowerCase().includes(query))
      );
      setFilteredSubcategories(filtered);
    }
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [searchQuery, subcategories]);

  const handleSort = (field: keyof Subcategory) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDelete = async (id: number, subcategoryName: string) => {
    // Use toast for confirmation instead of window.confirm
    const confirmPromise = new Promise<boolean>((resolve) => {
      toast(
        (t) => (
          <div className="flex flex-col items-center">
            <p className="mb-2">
              Are you sure you want to delete the subcategory "{subcategoryName}
              "?
            </p>
            <div className="flex space-x-2">
              <button
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(true);
                }}
              >
                Delete
              </button>
              <button
                className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ),
        { duration: 5000 }
      );
    });

    const isConfirmed = await confirmPromise;
    if (!isConfirmed) return;

    setIsDeleting(true);
    try {
      const { error } = await deleteSubcategory(id);
      if (error) {
        toast.error(`Failed to delete subcategory: ${error}`);
      } else {
        toast.success("Subcategory deleted successfully");
        // Use router.refresh() instead of window.location.reload()
        router.refresh();
      }
    } catch (error) {
      toast.error("An error occurred while deleting the subcategory");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const columns = getTableColumns(
    currentPage,
    itemsPerPage,
    handleDelete,
    isDeleting
  );

  // Sort subcategories
  const sortedSubcategories = [...filteredSubcategories].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortDirection === "asc"
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  // Paginate subcategories
  const paginatedSubcategories = sortedSubcategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col">
      <div className="mb-4">
        <Search
          placeholder="Search subcategories by name, description, or category..."
          onChange={handleSearch}
        />
      </div>

      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <TableHeader
                columns={columns}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              <TableBody
                subcategories={paginatedSubcategories}
                columns={columns}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
              />
            </table>
          </div>
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={filteredSubcategories.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
