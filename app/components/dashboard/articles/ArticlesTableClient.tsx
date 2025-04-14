"use client";

import React, { useState } from "react";
import { Article } from "../../../lib/definition";
import { TableHeader } from "./TableHeader";
import { TableBody } from "./TableBody";
import { Pagination } from "./Pagination";
import Link from "next/link";

interface ArticlesTableClientProps {
  articles: Article[];
  searchQuery?: string;
}

export function ArticlesTableClient({
  articles,
  searchQuery = "",
}: ArticlesTableClientProps) {
  const [currentPage, setCurrentPage] =
    useState(1);
  const [sortField, setSortField] =
    useState<keyof Article>("created_at");
  const [sortDirection, setSortDirection] =
    useState<"asc" | "desc">("desc");
  const itemsPerPage = 10;
  const totalPages = Math.ceil(
    articles.length / itemsPerPage
  );

  const handleSort = (field: keyof Article) => {
    if (field === sortField) {
      setSortDirection(
        sortDirection === "asc" ? "desc" : "asc"
      );
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter articles based on search query
  const filteredArticles = articles.filter(
    (article) =>
      Object.values(article).some(
        (value) =>
          value &&
          value
            .toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
  );

  // Sort articles
  const sortedArticles = [
    ...filteredArticles,
  ].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue === null || aValue === undefined)
      return 1;
    if (bValue === null || bValue === undefined)
      return -1;
    if (aValue === bValue) return 0;
    if (aValue < bValue)
      return sortDirection === "asc" ? -1 : 1;
    return sortDirection === "asc" ? 1 : -1;
  });

  // Paginate articles
  const paginatedArticles = sortedArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="mt-6 flow-root">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-md bg-gray-50">
            <div className="md:hidden">
              {paginatedArticles.map(
                (article) => (
                  <div
                    key={article.id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <p>{article.title}</p>
                        </div>
                        <p className="text-sm text-gray-500">
                          {article.content}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Link
                        href={`/dashboard/articles/${article.id}/edit`}
                        className="rounded border border-blue-500 px-3 py-1 text-blue-500 hover:bg-blue-100"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => {
                          // TODO: Implement delete functionality
                          console.log(
                            "Delete article:",
                            article.id
                          );
                        }}
                        className="rounded border border-red-500 px-3 py-1 text-red-500 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
            <table className="hidden min-w-full text-gray-900 md:table">
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
