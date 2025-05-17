"use client";

import SubcategoryArticles from "../SubcategoryArticles";
import ExploreTrendingTags from "../trending/ExploreTrendingTags";
import ExploreQuickLinks from "./ExploreQuickLinks";
import ExploreHero from "./ExploreHero";
import ExploreStats from "./ExploreStats";
import { useState, useEffect } from "react";
import { getArticles } from "@/app/lib/actions/articles";
import { Article } from "@/app/lib/definition";
import Link from "next/link";
import { LoadingSpinner } from "@/app/components/dashboard/shared/loading-spinner";
import { CalendarIcon, UserIcon } from "@heroicons/react/24/outline";

// Define the props interface for the ExploreContent component
// These props determine what content to display based on the URL parameters
interface ExploreContentProps {
  type?: "trending"; // Optional type parameter for trending content
  tag?: string; // Optional tag parameter for filtering by tag
  subcategory?: string; // Optional subcategory parameter for filtering by subcategory
}

/**
 * ExploreContent Component
 *
 * This component serves as the main content layout for the explore page.
 * It displays articles based on the provided filters (type, tag, or subcategory)
 * and includes two columns below the articles:
 * - Left column: Explore More Tags (trending tags)
 * - Right column: Quick Links (featured, headlines, trending)
 *
 * The component is responsive and maintains consistent styling across different views.
 */
export default function ExploreContent({
  type,
  tag,
  subcategory,
}: ExploreContentProps) {
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(true);

  useEffect(() => {
    const fetchRelatedArticles = async () => {
      try {
        setIsLoadingRelated(true);
        const articles = await getArticles();

        // Filter related articles based on current context
        let filtered = articles;
        if (tag) {
          // If viewing a tag, show articles with similar tags
          filtered = articles.filter((article) =>
            article.tag_names?.some((t: string) => t !== tag)
          );
        } else if (subcategory) {
          // If viewing a subcategory, show articles from the same category
          filtered = articles.filter(
            (article) => article.sub_category_id?.toString() !== subcategory
          );
        } else if (type === "trending") {
          // If viewing trending, show non-trending articles
          filtered = articles.filter((article) => !article.is_trending);
        }

        // Sort by published date and take the most recent 4
        const sorted = filtered
          .sort((a, b) => {
            const dateA = a.published_at
              ? new Date(a.published_at).getTime()
              : 0;
            const dateB = b.published_at
              ? new Date(b.published_at).getTime()
              : 0;
            return dateB - dateA;
          })
          .slice(0, 4);

        setRelatedArticles(sorted);
      } catch (error) {
        console.error("Error fetching related articles:", error);
      } finally {
        setIsLoadingRelated(false);
      }
    };

    fetchRelatedArticles();
  }, [type, tag, subcategory]);

  return (
    <div className="space-y-8">
      {/* Main Articles Section */}
      {/* Displays articles filtered by type, tag, or subcategory */}
      <ExploreHero type={type} tag={tag} subcategory={subcategory} />
      <ExploreStats type={type} tag={tag} subcategory={subcategory} />
      <SubcategoryArticles type={type} tag={tag} subcategory={subcategory} />

      {/* Two-Column Layout for Tags and Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Explore More Tags */}
        {/* Displays trending tags with their article counts */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Explore More Tags
          </h3>
          <ExploreTrendingTags />
        </div>

        {/* Right Column: Quick Links */}
        {/* Provides quick access to featured, headlines, and trending articles */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Links
          </h3>
          <ExploreQuickLinks />
        </div>
      </div>

      {/* Related Articles Section */}
      {/* Displays articles related to the current context */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Related Articles
        </h3>

        {isLoadingRelated ? (
          <div className="flex justify-center items-center h-32">
            <LoadingSpinner />
          </div>
        ) : relatedArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedArticles.map((article) => (
              <Link
                key={article.id}
                href={`/article/${article.id}`}
                className="group block"
              >
                <div className="space-y-3">
                  {article.image && (
                    <div className="aspect-video relative rounded-lg overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <h4 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 line-clamp-2">
                    {article.title}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      <span>
                        {article.published_at
                          ? new Date(article.published_at).toLocaleDateString()
                          : "No date"}
                      </span>
                    </div>
                    {article.author_name && (
                      <div className="flex items-center gap-1">
                        <UserIcon className="h-4 w-4" />
                        <span>{article.author_name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No related articles found.
          </p>
        )}
      </div>
    </div>
  );
}
