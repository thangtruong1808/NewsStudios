"use client";

import { Article } from "@/app/lib/definition";
import ArticleForm from "./ArticleForm";

// Component Info
// Description: Container component that wraps the article form with layout styling.
// Date updated: 2025-November-21
// Author: thangtruong

interface ArticleFormContainerProps {
  article?: Partial<Article>;
  categories: any[];
  authors: any[];
  subcategories: any[];
  tags: any[];
}

export default function ArticleFormContainer({
  article,
  categories,
  authors,
  subcategories,
  tags,
}: ArticleFormContainerProps) {
  return (
    <div className="w-full">
      {/* Form wrapper with styling */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <ArticleForm
          article={article}
          categories={categories}
          authors={authors}
          subcategories={subcategories}
          tags={tags}
        />
      </div>
    </div>
  );
}
