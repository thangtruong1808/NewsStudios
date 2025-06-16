"use client";

import SingleArticle from "./SingleArticle";
import NavBar from "../navbar/NavBar";
import Footer from "../Footer";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";

interface ArticlePageProps {
  articleId: number;
}

export default function ArticlePage({ articleId }: ArticlePageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        {/* Main Article */}
        <div className="mb-16">
          <SingleArticle articleId={articleId} />
        </div>

        {/* Comments Section */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <ChatBubbleLeftIcon className="h-6 w-6 text-gray-600" />
              <h2 className="text-2xl font-bold text-gray-900">Comments</h2>
            </div>
            <div className="text-center py-8 text-gray-500">
              <p>Comments are coming soon!</p>
              <p className="text-sm mt-2">
                We're working on adding a comment system to enhance the
                discussion.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
} 