"use client";

import { Article } from "@/app/lib/definition";
import ArticleForm from "./ArticleForm";

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
