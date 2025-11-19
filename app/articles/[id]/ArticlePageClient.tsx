"use client";

// Component Info
// Description: Client component rendering article detail page with comments section.
// Date created: 2025-01-27
// Author: thangtruong

import SingleArticle from "@/app/components/front-end/articles/SingleArticle";
import Comments from "@/app/components/front-end/articles/components/Comments";

interface ArticlePageClientProps {
  params: {
    id: string;
  };
}

export default function ArticlePageClient({ params }: ArticlePageClientProps) {
  // Ensure id is a valid number
  const articleId = parseInt(params.id);
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
        <SingleArticle articleId={articleId} />
      </div>

      {/* Comments Section */}
      <section className="mb-16">
        <Comments articleId={articleId} />
      </section>
    </>
  );
} 