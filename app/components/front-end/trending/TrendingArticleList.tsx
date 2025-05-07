import { Article } from "@/app/lib/definition";
import { TrendingArticleCard } from "./TrendingArticleCard";

interface TrendingArticleListProps {
  articles: Article[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const TrendingArticleList = ({
  articles,
  currentPage,
  totalPages,
  onPageChange,
}: TrendingArticleListProps) => (
  <div className="space-y-4 h-full">
    <div className="relative h-full flex flex-col bg-white rounded-xl shadow-sm p-2">
      <div className="flex-1 overflow-hidden">
        <div className="space-y-2 h-full">
          {articles.map((article) => (
            <TrendingArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-2 pt-2 border-t border-gray-200">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`px-2 py-1 rounded-md transition-all duration-300 text-sm font-medium ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white/80 hover:bg-white shadow-md text-gray-700"
          }`}
        >
          First
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-2 py-1 rounded-md transition-all duration-300 text-sm font-medium ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white/80 hover:bg-white shadow-md text-gray-700"
          }`}
        >
          Previous
        </button>
        <span className="px-2 py-1 text-sm font-medium text-gray-700">
          Article {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-2 py-1 rounded-md transition-all duration-300 text-sm font-medium ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white/80 hover:bg-white shadow-md text-gray-700"
          }`}
        >
          Next
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`px-2 py-1 rounded-md transition-all duration-300 text-sm font-medium ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white/80 hover:bg-white shadow-md text-gray-700"
          }`}
        >
          Last
        </button>
      </div>
    </div>
  </div>
);
