"use client";

import { Article } from "@/app/lib/definition";
import ArticleForm from "./ArticleForm";

interface ArticleFormContainerProps {
  article?: Partial<Article>;
  categories: any[];
  authors: any[];
  subcategories: any[];
  users: any[];
  tags: any[];
}

export default function ArticleFormContainer({
  article,
  categories,
  authors,
  subcategories,
  users,
  tags,
}: ArticleFormContainerProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-2">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <ArticleForm
            article={article}
            categories={categories}
            authors={authors}
            subcategories={subcategories}
            users={users}
            tags={tags}
          />
        </div>
      </div>
    </div>
  );
}
