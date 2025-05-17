"use client";

import { useState, useEffect } from "react";
import { getArticles } from "@/app/lib/actions/articles";
import { Article } from "@/app/lib/definition";
import { LoadingSpinner } from "@/app/components/dashboard/shared/loading-spinner";
import Link from "next/link";
import Image from "next/image";
import { UserIcon, ClockIcon } from "@heroicons/react/24/outline";

interface RelatedArticlesProps {
  currentArticleId: number;
}

export default function RelatedArticles({
  currentArticleId,
}: RelatedArticlesProps) {
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedArticles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const articles = await getArticles();
        const articleData = articles.data || [];

        if (!articleData || articleData.length === 0) {
          setRelatedArticles([]);
          return;
        }

        // Get 4 random articles excluding the current one
        const filteredArticles = articleData
          .filter((article: Article) => article.id !== currentArticleId)
          .sort(() => Math.random() - 0.5)
          .slice(0, 4);

        setRelatedArticles(filteredArticles);
      } catch (error) {
        console.error("Error fetching related articles:", error);
        setError("Failed to load related articles");
      } finally {
        setIsLoading(false);
      }
    };

    if (currentArticleId) {
      fetchRelatedArticles();
    }
  }, [currentArticleId]);

  if (error) {
    return (
      <section className="mb-16">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-center py-8 text-red-500">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-16">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span>Related Articles</span>
          {isLoading && <LoadingSpinner />}
        </h2>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : relatedArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedArticles.map((article) => (
              <Link
                key={article.id}
                href={`/article/${article.id}`}
                className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100"
              >
                {article.image && (
                  <div className="relative aspect-video">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <ClockIcon className="h-4 w-4" />
                      {article.published_at
                        ? new Date(article.published_at).toLocaleDateString()
                        : "No date"}
                    </span>
                    {article.author_name && (
                      <span className="flex items-center gap-1">
                        <UserIcon className="h-4 w-4" />
                        {article.author_name}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No related articles found.</p>
          </div>
        )}
      </div>
    </section>
  );
}
