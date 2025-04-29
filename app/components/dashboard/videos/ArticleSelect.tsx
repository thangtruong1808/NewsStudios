"use client";

import React from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { Article } from "@/app/lib/definition";

interface ArticleSelectProps {
  articles: Pick<Article, "id" | "title">[];
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

export function ArticleSelect({
  articles,
  value,
  onChange,
  error,
}: ArticleSelectProps) {
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
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">Select an article</option>
        {articles.map((article) => (
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
