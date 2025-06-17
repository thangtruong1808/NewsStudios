"use client";

import SingleArticle from "@/app/components/front-end/articles/SingleArticle";
import NavBar from "@/app/components/front-end/navbar/NavBar";
import Footer from "@/app/components/front-end/Footer";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";

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
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <main className="container mx-auto px-4 py-8">
          <div className="bg-red-50 p-6 rounded-xl">
            <p className="text-red-700 text-center">
              <h2 className="text-2xl font-bold mb-2">Invalid Article ID</h2>
              <p>The article ID must be a valid number.</p>
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
                We&apos;re working on adding a comment system to enhance the
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