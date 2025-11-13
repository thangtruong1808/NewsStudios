"use client";

import { Column } from "@/app/components/dashboard/shared/table";
import { Article } from "@/app/lib/definition";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import ExpandableContent from "@/app/components/dashboard/shared/table/ExpandableContent";
import ExpandableTagList from "./ExpandableTagList";
import { formatDateToLocal } from "@/app/lib/utils/dateFormatter";

/* eslint-disable no-unused-vars */
interface ArticlesTableColumnsProps {
  isDeleting: boolean;
  onEdit: (params: { item: Article }) => void;
  onDelete: (params: { item: Article }) => void;
  isAdmin: boolean;
}
/* eslint-enable no-unused-vars */

// Description: Provide configured columns for the dashboard articles table including actions and formatters.
// Data created: 2024-11-13
// Author: thangtruong
export function getArticlesTableColumns({
  isDeleting,
  onEdit,
  onDelete,
  isAdmin,
}: ArticlesTableColumnsProps): Column<Article & { sequence: number }>[] {
  // Base column definitions
  const baseColumns: Column<Article & { sequence: number }>[] = [
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
        field: "title",
        label: "Title",
        sortable: true,
        render: ({ value }) => (
          <ExpandableContent
            content={String(value ?? "")}
            maxWords={20}
            className="font-medium text-gray-900"
          />
        ),
      },
      {
        field: "content",
        label: "Content",
        sortable: true,
        render: ({ value }) => (
          <ExpandableContent
            content={String(value ?? "")}
            maxWords={20}
            className="text-gray-600"
          />
        ),
      },
      {
        field: "category_name",
        label: "Category",
        sortable: true,
      },
      {
        field: "subcategory_name",
        label: "Subcategory",
        sortable: true,
      },
      {
        field: "author_name",
        label: "Author",
        sortable: true,
      },
      {
        field: "tag_names",
        label: "Tags",
        sortable: false,
        render: ({ value, row }) => {
          const safeTags = Array.isArray(value)
            ? value.map((tag) => String(tag))
            : [];

          const safeColors = Array.isArray(row.tag_colors)
            ? row.tag_colors.map((color) => String(color))
            : [];

          return <ExpandableTagList tags={safeTags} tagColors={safeColors} />;
        },
      },
      {
        field: "views_count",
        label: "Views",
        sortable: true,
      },
      {
        field: "likes_count",
        label: "Likes",
        sortable: true,
      },
      {
        field: "comments_count",
        label: "Comments",
        sortable: true,
      },
      {
        field: "published_at",
        label: "Published At",
        sortable: true,
        render: ({ value }) => (
          <div className="min-w-[120px]">
            {formatDateToLocal(String(value))}
          </div>
        ),
      },
      {
        field: "updated_at",
        label: "Updated At",
        sortable: true,
        render: ({ value }) => (
          <div className="min-w-[120px]">
            {formatDateToLocal(String(value))}
          </div>
        ),
      },
    ];

  // Conditional actions column
  if (isAdmin) {
    baseColumns.push({
      field: "id" as keyof (Article & { sequence: number }),
      label: "Actions",
      sortable: false,
      render: ({ row }: { row: Article & { sequence: number } }) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit({ item: row })}
            className="text-blue-600 hover:text-blue-900"
            aria-label="Edit article"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete({ item: row })}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-900 disabled:opacity-50"
            aria-label="Delete article"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      ),
    });
  }

  return baseColumns;
}
