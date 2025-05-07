import Link from "next/link";
import Image from "next/image";
import { Article } from "@/app/lib/definition";
import { FireIcon } from "@heroicons/react/24/solid";
import { CalendarIcon, TagIcon } from "@heroicons/react/24/outline";

export const TrendingArticleCard = ({ article }: { article: Article }) => (
  <Link
    href={`/article/${article.id}`}
    className="group flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm hover:shadow-lg transition-all duration-300"
  >
    <div className="relative w-20 h-20 flex-shrink-0">
      {article.image ? (
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover rounded-lg"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
          <div className="text-orange-600 text-2xl font-bold">
            {article.title.charAt(0).toUpperCase()}
          </div>
        </div>
      )}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-300 truncate">
        {article.title}
      </h4>
      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
        {article.content}
      </p>
      <div className="mt-2 flex items-center gap-2">
        <span className="inline-flex items-center text-xs text-gray-500">
          <CalendarIcon className="h-4 w-4 mr-1" />
          {new Date(article.published_at || "").toLocaleDateString()}
        </span>
        {article.category_name && (
          <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
            <TagIcon className="h-3 w-3 mr-1" />
            {article.category_name}
          </span>
        )}
        <span className="inline-flex items-center px-2 py-0.5 bg-orange-100 rounded-full text-xs font-medium text-orange-700">
          <FireIcon className="h-3 w-3 mr-1" />
          Trending
        </span>
      </div>
    </div>
  </Link>
);
