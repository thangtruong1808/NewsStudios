"use client";

import React, { useState, useEffect } from "react";
import { Article } from "../../../type/Article";
import { TableHeader } from "./TableHeader";
import { TableBody } from "./TableBody";
import { Pagination } from "./Pagination";
import { Search } from "../../search/Search";

interface ArticlesTableClientProps {
  articles: Article[];
}

export default function ArticlesTableClient({
  articles,
}: ArticlesTableClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredArticles, setFilteredArticles] = useState(articles);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Article>("published_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const itemsPerPage = 10;

  useEffect(() => {
    const filtered = articles.filter((article) =>
      Object.values(article).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setFilteredArticles(filtered);
    setCurrentPage(1);
  }, [searchQuery, articles]);

  const handleSort = (field: keyof Article) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    // Handle null values
    if (aValue === null) return 1;
    if (bValue === null) return -1;

    // Handle undefined values
    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;

    // Compare values
    if (aValue === bValue) return 0;
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    return sortDirection === "asc" ? 1 : -1;
  });

  const totalPages = Math.ceil(sortedArticles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentArticles = sortedArticles.slice(startIndex, endIndex);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="mb-4">
            <Search
              placeholder="Search articles..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
          <div className="md:hidden">
            {currentArticles.map((article) => (
              <div
                key={article.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{article.title}</p>
                    </div>
                    <p className="text-sm text-gray-500">{article.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <TableHeader
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <TableBody articles={currentArticles} />
          </table>
        </div>
      </div>
      <div className="mt-5 flex w-full justify-center">
        <Pagination
          totalItems={filteredArticles.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
