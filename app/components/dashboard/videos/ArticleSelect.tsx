"use client";

import React from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { Article } from "@/app/lib/definition";

interface ArticleSelectProps {
  articles: Pick<Article, "id" | "title">[];
  selectedArticleId: number | null;
  onArticleChange: (articleId: number | null) => void;
  error?: string;
}

export default function ArticleSelect({
  articles = [],
  selectedArticleId,
  onArticleChange,
  error,
}: ArticleSelectProps) {
  const articleList = Array.isArray(articles) ? articles : [];

  return (
    <div>
      <label
        htmlFor="article_id"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Article
      </label>
      <select
        id="article_id"
        value={selectedArticleId || ""}
        onChange={(e) =>
          onArticleChange(e.target.value ? Number(e.target.value) : null)
        }
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      >
        <option value="">Select an article</option>
        {articleList.map((article) => (
          <option key={article.id} value={article.id}>
            {article.title}
          </option>
        ))}
      </select>
      {error && (
        <div className="mt-1 flex items-center text-sm text-red-500">
          <ExclamationCircleIcon className="mr-1 h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
}
