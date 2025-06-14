"use client";

import SingleArticle from "@/app/components/front-end/articles/SingleArticle";
import NavBar from "@/app/components/front-end/navbar/NavBar";
import Footer from "@/app/components/front-end/Footer";
import RelatedArticles from "@/app/components/front-end/relative-articles/RelativeArticles";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";

interface ArticlePageProps {
  params: {
    id: string;
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const articleId = parseInt(params.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        {/* Main Article */}
        <div className="mb-16">
          <SingleArticle articleId={articleId} />
        </div>

        {/* Related Articles Section */}
        {/* <RelatedArticles currentArticleId={articleId} /> */}

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
