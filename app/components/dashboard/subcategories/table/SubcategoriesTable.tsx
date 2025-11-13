"use client";

import Table from "@/app/components/dashboard/shared/table/Table";
import type { Column } from "@/app/components/dashboard/shared/table/TableTypes";
import { SubCategory } from "@/app/lib/definition";
import ExpandableContent from "@/app/components/dashboard/shared/table/ExpandableContent";
import { formatDateWithMonth } from "@/app/lib/utils/dateFormatter";
import { useSession } from "next-auth/react";

/* eslint-disable no-unused-vars */
interface SubcategoriesTableProps {
  subcategories: SubCategory[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  sortField: keyof SubCategory;
  sortDirection: "asc" | "desc";
  searchQuery: string;
  isDeleting: boolean;
  isLoading: boolean;
  onSort: (field: keyof SubCategory) => void;
  onPageChange: (page: number) => void;
  onEdit: (subcategory: SubCategory) => void;
  onDelete: (subcategory: SubCategory) => void;
  onItemsPerPageChange: (limit: number) => void;
}
/* eslint-enable no-unused-vars */

// Description: Render subcategories table with pagination, sorting, and admin actions.
// Data created: 2024-11-13
// Author: thangtruong
export default function SubcategoriesTable({
  subcategories,
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  sortField,
  sortDirection,
  searchQuery,
  isDeleting,
  isLoading,
  onSort,
  onPageChange,
  onEdit,
  onDelete,
  onItemsPerPageChange,
}: SubcategoriesTableProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  const augmentedSubcategories = subcategories.map((subcategory, index) => ({
    ...subcategory,
    sequence: (currentPage - 1) * itemsPerPage + index + 1,
  }));

  const columns: Column<SubCategory & { sequence: number }>[] = [
    {
      field: "sequence",
      label: "#",
      sortable: false,
      render: ({ value }) => (
        <span className="text-sm text-gray-500">
          {typeof value === "number" ? value : Number(value ?? 0)}
        </span>
      ),
    },
    {
      field: "name",
      label: "Name",
      sortable: true,
      render: ({ value }) => (
        <span className="text-sm text-gray-500">
          {typeof value === "string" ? value : String(value ?? "")}
        </span>
      ),
    },
    {
      field: "description",
      label: "Description",
      sortable: true,
      render: ({ value }) => (
        <div className="w-64">
          <ExpandableContent
            content={
              typeof value === "string" && value.length > 0
                ? value
                : "No description"
            }
            maxWords={10}
            className="text-sm text-gray-500"
          />
        </div>
      ),
    },
    {
      field: "category_name",
      label: "Category",
      sortable: true,
      render: ({ value }) => (
        <span className="text-sm text-gray-500">
          {typeof value === "string" ? value : String(value ?? "")}
        </span>
      ),
    },
    {
      field: "articles_count",
      label: "Articles",
      sortable: true,
      render: ({ value }) => {
        const total =
          typeof value === "number"
            ? value
            : Number.parseInt(String(value ?? 0), 10);
        return (
          <div className="w-20">
            <span className="text-sm text-gray-500 whitespace-nowrap text-left">
              {Number.isNaN(total) ? 0 : total}
            </span>
          </div>
        );
      },
    },
    {
      field: "created_at",
      label: "Created At",
      sortable: true,
      render: ({ value }) => (
        <div className="w-32">
          <span className="text-sm text-gray-500 whitespace-nowrap text-left">
            {formatDateWithMonth(String(value ?? ""))}
          </span>
        </div>
      ),
    },
    {
      field: "updated_at",
      label: "Updated At",
      sortable: true,
      render: ({ value }) => (
        <div className="w-32">
          <span className="text-sm text-gray-500 whitespace-nowrap text-left">
            {formatDateWithMonth(String(value ?? ""))}
          </span>
        </div>
      ),
    },
  ];

  if (isAdmin) {
    columns.push({
      field: "actions",
      label: "Actions",
      sortable: false,
      render: () => null,
    });
  }

  return (
    <div className="">
      <Table
        data={augmentedSubcategories}
        columns={columns}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={({ field }) => {
          if (field === "sequence") return;
          onSort(field as keyof SubCategory);
        }}
        onPageChange={({ page }) => onPageChange(page)}
        onEdit={({ item }) => onEdit(item)}
        onDelete={({ item }) => onDelete(item)}
        isDeleting={isDeleting}
        searchQuery={searchQuery}
        isLoading={isLoading}
        onItemsPerPageChange={({ limit }) => onItemsPerPageChange(limit)}
      />
    </div>
  );
}
