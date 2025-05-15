"use client";

import { Column } from "@/app/components/dashboard/shared/table";
import { Article } from "@/app/lib/definition";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import ExpandableContent from "@/app/components/dashboard/shared/table/ExpandableContent";

/**
 * Interface for the column configuration props
 */
interface ArticlesTableColumnsProps {
  isDeleting: boolean;
  onEdit: (article: Article) => void;
  onDelete: (article: Article) => void;
}

/**
 * ArticlesTableColumns Component
 * Defines the column configuration for the articles table, including:
 * - Column definitions with custom renderers
 * - Sorting capabilities
 * - Action buttons for edit and delete operations
 * - Expandable content for long text fields
 */
export function getArticlesTableColumns({
  isDeleting,
  onEdit,
  onDelete,
}: ArticlesTableColumnsProps): Column<
  Article & { sequence?: number; actions?: never }
>[] {
  return [
    {
      field: "sequence",
      label: "#",
      sortable: false,
    },
    {
      field: "title",
      label: "Title",
      sortable: true,
      render: (value) => (
        <div className="w-48">
          <ExpandableContent content={value} maxWords={20} />
        </div>
      ),
    },
    {
      field: "content",
      label: "Content",
      sortable: true,
      render: (value) => (
        <div className="w-64">
          <ExpandableContent content={value} maxWords={20} />
        </div>
      ),
    },
    {
      field: "category_id",
      label: "Category",
      sortable: true,
      render: (_, article) => (
        <div className="w-32">
          <ExpandableContent
            content={article.category_name || "Uncategorized"}
            maxWords={20}
          />
        </div>
      ),
    },
    {
      field: "sub_category_id",
      label: "SubCategory",
      sortable: true,
      render: (_, article) => (
        <div className="w-32">
          <ExpandableContent
            content={article.sub_category_name || "None"}
            maxWords={20}
          />
        </div>
      ),
    },
    {
      field: "published_at",
      label: "Published At",
      sortable: true,
      render: (value) => (
        <div className="w-32">
          <span className="text-sm text-zinc-500 whitespace-nowrap text-left">
            {new Date(value).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      field: "updated_at",
      label: "Updated At",
      sortable: true,
      render: (value) => (
        <div className="w-32">
          <span className="text-sm text-zinc-500 whitespace-nowrap text-left">
            {new Date(value).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      field: "is_featured",
      label: "Featured",
      sortable: true,
      render: (value) => (
        <div className="w-24">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              value
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {value ? "Yes" : "No"}
          </span>
        </div>
      ),
    },
    {
      field: "is_trending",
      label: "Trending",
      sortable: true,
      render: (value) => (
        <div className="w-24">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              value
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {value ? "Yes" : "No"}
          </span>
        </div>
      ),
    },
    {
      field: "actions",
      label: "Actions",
      sortable: false,
      render: (_, article) => (
        <div className="flex justify-start items-start space-x-2">
          <button
            onClick={() => onEdit(article)}
            className="inline-flex items-center gap-1 rounded border border-blue-500 px-3 py-1.5 text-sm font-medium text-blue-500 hover:bg-blue-50 transition-colors duration-200"
          >
            <PencilIcon className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(article)}
            disabled={isDeleting}
            className="inline-flex items-center gap-1 rounded border border-red-500 px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
          >
            <TrashIcon className="h-4 w-4" />
            Delete
          </button>
        </div>
      ),
    },
  ];
}
