import ArticlePage from "@/app/components/front-end/articles/ArticlePage";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  // Ensure id is a valid number
  const articleId = parseInt(params.id);
  if (isNaN(articleId)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 p-6 rounded-xl">
            <p className="text-red-700 text-center">
              <h2 className="text-2xl font-bold mb-2">Invalid Article ID</h2>
              <p>The article ID must be a valid number.</p>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <ArticlePage articleId={articleId} />;
}
