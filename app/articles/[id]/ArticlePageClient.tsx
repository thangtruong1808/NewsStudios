"use client";

// Component Info
// Description: Client component rendering article detail page with comments section and real-time comment count updates.
// Date created: 2025-01-27
// Author: thangtruong

import { useState, useCallback } from "react";
import SingleArticle from "@/app/components/front-end/articles/SingleArticle";
import Comments from "@/app/components/front-end/articles/components/Comments";

interface ArticlePageClientProps {
  params: {
    id: string;
  };
}

export default function ArticlePageClient({ params }: ArticlePageClientProps) {
  const articleId = parseInt(params.id);
  const [commentsCount, setCommentsCount] = useState<number | null>(null);

  // Handle comment count update
  const handleCommentCountUpdate = useCallback((count: number) => {
    setCommentsCount(count);
  }, []);

  if (isNaN(articleId)) {
    return (
      <div className="bg-red-50 p-6 rounded-xl">
        <div className="text-red-700 text-center">
          <h2 className="text-2xl font-bold mb-2">Invalid Article ID</h2>
          <p>The article ID must be a valid number.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Article */}
      <div className="mb-16">
        <SingleArticle articleId={articleId} commentsCount={commentsCount} />
      </div>

      {/* Comments Section */}
      <section className="mb-16">
        <Comments articleId={articleId} onCommentCountUpdate={handleCommentCountUpdate} />
      </section>
    </>
  );
} 