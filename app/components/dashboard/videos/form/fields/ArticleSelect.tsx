"use client";

import { useState, useEffect } from "react";
import { getArticles } from "@/app/lib/actions/articles";
import { Article } from "@/app/lib/definition";

interface ArticleSelectProps {
  value: number | null;
  onChange: (value: number | null) => void;
}

export default function ArticleSelect({ value, onChange }: ArticleSelectProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const result = await getArticles();
        if (result.error) {
          throw new Error(result.error);
        }
        setArticles(result.data || []);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div>
      <label
        htmlFor="article"
        className="block text-sm font-medium text-gray-700"
      >
        Associated Article
      </label>
      <select
        id="article"
        value={value || ""}
        onChange={(e) =>
          onChange(e.target.value ? Number(e.target.value) : null)
        }
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        disabled={isLoading}
      >
        <option value="">Select an article</option>
        {articles.map((article) => (
          <option key={article.id} value={article.id}>
            {article.title}
          </option>
        ))}
      </select>
    </div>
  );
}
