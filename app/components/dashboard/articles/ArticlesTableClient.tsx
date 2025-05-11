"use client";

import React, { useState } from "react";
import { Article } from "../../../lib/definition";
import { TableHeader } from "./TableHeader";
import { TableBody } from "./TableBody";
import { Pagination } from "./Pagination";
import Link from "next/link";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { deleteArticle } from "../../../lib/actions/articles";
import { format } from "date-fns";

interface ArticlesTableClientProps {
  articles: Article[];
  searchQuery?: string;
}

export function ArticlesTableClient({
  articles,
  searchQuery = "",
}: ArticlesTableClientProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Article>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const itemsPerPage = 10;
  const totalPages = Math.ceil(articles.length / itemsPerPage);

  const handleSort = (field: keyof Article) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleEdit = (articleId: number) => {
    router.push(`/dashboard/articles/${articleId}/edit?edit=true`, {
      scroll: false,
    });
  };

  const handleDelete = async (articleId: number) => {
    try {
      setIsDeleting(true);
      const success = await deleteArticle(articleId);
      if (success) {
        toast.success("Article deleted successfully");
        router.refresh();
      } else {
        toast.error("Failed to delete article");
      }
    } catch (error) {
      toast.error("Failed to delete article");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter articles based on search query
  const filteredArticles = articles.filter((article) =>
    Object.values(article).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Sort articles
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;
    if (aValue === bValue) return 0;
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    return sortDirection === "asc" ? 1 : -1;
  });

  // Paginate articles
  const paginatedArticles = sortedArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "-";
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return format(dateObj, "dd/MM/yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "-";
    }
  };

  return (
    <div className="mt-6 flow-root">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-md bg-gray-50">
            {/* Mobile View */}
            <div className="md:hidden">
              {paginatedArticles.map((article, index) => (
                <div
                  key={article.id}
                  className="mb-4 w-full rounded-md bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:bg-zinc-200/50"
                >
                  {/* Header with ID and Title */}
                  <div className="border-b border-gray-100 pb-3">
                    <div className="flex flex-col space-y-2">
                      <span className="text-base font-medium text-gray-500">
                        #{(currentPage - 1) * itemsPerPage + index + 1}
                      </span>
                      <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
                        {article.title}
                      </h3>
                    </div>
                  </div>

                  {/* Article Details */}
                  <div className="mt-3 space-y-2">
                    <div className="text-sm text-gray-500 line-clamp-3">
                      {article.content}
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="text-gray-500">Category:</span>
                      <span className="text-gray-900">
                        {article.category_name || "Unknown"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="text-gray-500">Author:</span>
                      <span className="text-gray-900">
                        {article.author_name || "Unknown"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="text-gray-500">Published:</span>
                      <span className="text-gray-900">
                        {article.published_at
                          ? formatDate(article.published_at)
                          : "Not published"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="text-gray-500">Status:</span>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          article.is_featured
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {article.is_featured ? "Featured" : "Regular"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex justify-around border-t border-gray-100 pt-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(article.id)}
                        className="inline-flex items-center gap-1 rounded border border-blue-500 px-3 py-1.5 text-sm font-medium text-blue-500 hover:bg-blue-50 transition-colors duration-200"
                      >
                        <PencilIcon className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        disabled={isDeleting}
                        className="inline-flex items-center gap-1 rounded border border-red-500 px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
                      >
                        <TrashIcon className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tablet/Medium Desktop View (1024px - 1440px) */}
            <div className="hidden md:block 2xl:hidden">
              {paginatedArticles.map((article, index) => (
                <div
                  key={article.id}
                  className="mb-4 w-full rounded-md bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:bg-zinc-200/50"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-base font-medium text-gray-500">
                          #{(currentPage - 1) * itemsPerPage + index + 1}
                        </span>
                        <h3 className="text-base font-medium text-gray-900 line-clamp-2">
                          {article.title}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(article.id)}
                          className="inline-flex items-center gap-1 rounded border border-blue-500 px-3 py-1.5 text-sm font-medium text-blue-500 hover:bg-blue-50 transition-colors duration-200"
                        >
                          <PencilIcon className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          disabled={isDeleting}
                          className="inline-flex items-center gap-1 rounded border border-red-500 px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
                        >
                          <TrashIcon className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm text-gray-500 line-clamp-3">
                          {article.content}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">
                            Category:
                          </span>
                          <span className="text-sm text-gray-900">
                            {article.category_name || "Unknown"}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">Author:</span>
                          <span className="text-sm text-gray-900">
                            {article.author_name || "Unknown"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">
                            Published:
                          </span>
                          <span className="text-sm text-gray-900">
                            {article.published_at
                              ? formatDate(article.published_at)
                              : "Not published"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">Status:</span>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              article.is_featured
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {article.is_featured ? "Featured" : "Regular"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Large Desktop View (1440px and above) */}
            <table className="hidden 2xl:table min-w-full text-gray-900">
              <TableHeader
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              <TableBody
                articles={paginatedArticles}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
              />
            </table>
          </div>
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalItems={sortedArticles.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
