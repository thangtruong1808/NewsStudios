"use client";

import { useState } from "react";
import { SubCategory as Subcategory } from "../../../lib/definition";
import { getTableColumns } from "./TableColumns";
import { toast } from "react-hot-toast";
import { deleteSubcategory } from "../../../lib/actions/subcategories";
import { useRouter } from "next/navigation";
import Pagination from "../categories/Pagination";
import { TableHeader } from "./TableHeader";
import TableBody from "./TableBody";

interface SubcategoriesTableClientProps {
  subcategories: Subcategory[];
}

export default function SubcategoriesTableClient({
  subcategories,
}: SubcategoriesTableClientProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const itemsPerPage = 10;

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete subcategory "${name}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteSubcategory(id);
      if (!result.success) {
        toast.error(
          <div>
            <p className="font-bold">Failed to delete subcategory</p>
            <p className="text-sm">{result.error}</p>
          </div>,
          { duration: 5000 }
        );
      } else {
        toast.success("Subcategory deleted successfully");
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      toast.error(
        <div>
          <p className="font-bold">
            An error occurred while deleting the subcategory
          </p>
          <p className="text-sm">Please try again later</p>
        </div>,
        { duration: 5000 }
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const columns = getTableColumns(
    currentPage,
    itemsPerPage,
    handleDelete,
    isDeleting
  );

  const sortData = (data: Subcategory[]) => {
    return [...data].sort((a, b) => {
      const aValue = a[sortField as keyof Subcategory];
      const bValue = b[sortField as keyof Subcategory];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === "asc"
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      return 0;
    });
  };

  // Sort subcategories
  const sortedSubcategories = sortData(subcategories);

  // Paginate subcategories
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubcategories = sortedSubcategories.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const totalPages = Math.ceil(subcategories.length / itemsPerPage);

  return (
    <div className="mt-6 flow-root">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-md bg-gray-50">
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
        totalItems={subcategories.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
