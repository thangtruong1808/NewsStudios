"use client";

import { useState } from "react";
import { SubCategory as Subcategory } from "../../../lib/definition";
import { getTableColumns } from "./TableColumns";
import { toast } from "react-hot-toast";
import { deleteSubcategory } from "../../../lib/actions/subcategories";
import { useRouter } from "next/navigation";
import Pagination from "../categories/Pagination";

interface SubcategoriesTableClientProps {
  subcategories: Subcategory[];
}

export default function SubcategoriesTableClient({
  subcategories,
}: SubcategoriesTableClientProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
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

  const columns = getTableColumns(
    currentPage,
    itemsPerPage,
    handleDelete,
    isDeleting
  );
  const totalPages = Math.ceil(subcategories.length / itemsPerPage);
  const paginatedSubcategories = subcategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="mt-6 flow-root">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-md bg-gray-50">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="rounded-lg text-left text-sm font-normal bg-zinc-200">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.accessorKey}
                      scope="col"
                      className="px-2 py-3 font-medium border-b border-zinc-300"
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {paginatedSubcategories.map((subcategory, index) => (
                  <tr
                    key={subcategory.id}
                    className="hover:bg-gray-100 transition-colors duration-150"
                  >
                    {columns.map((column) => (
                      <td
                        key={`${subcategory.id}-${column.accessorKey}`}
                        className="whitespace-nowrap px-3 py-3 text-xs"
                      >
                        {column.cell(
                          subcategory[column.accessorKey] || "",
                          index,
                          subcategory
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
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
