"use client";

import type { ChangeEvent } from "react";
import type { Article } from "@/app/lib/definition";

/* eslint-disable no-unused-vars */
interface ArticleSelectProps {
  value: number;
  onChange: (value: number | undefined) => void;
  articles: Article[];
}
/* eslint-enable no-unused-vars */

// Description: Render article selector dropdown for associating videos with articles.
// Data created: 2024-11-13
// Author: thangtruong
export default function ArticleSelect({
  value,
  onChange,
  articles,
}: ArticleSelectProps) {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const parsed = Number.parseInt(event.target.value, 10);
    onChange(Number.isNaN(parsed) || parsed === 0 ? undefined : parsed);
  };

  return (
    <div>
      <label htmlFor="article_id" className="block text-sm font-medium">
        Article <span className="text-xs">(*)</span>
      </label>
      <div className="mt-2">
        <select
          id="article_id"
          value={value}
          onChange={handleChange}
          className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-2 py-2"
        >
          <option value={0}>Select an article</option>
          {articles.map((article) => (
            <option key={article.id} value={article.id}>
              [{article.id}] {article.title}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
