import { ClockIcon, UserIcon } from "@heroicons/react/24/outline";
import { ArticleProps } from "./types";

export const ArticleInfo = ({ article }: ArticleProps) => (
  <div className="flex items-center space-x-4 text-sm text-gray-500">
    <span className="flex items-center space-x-1">
      <ClockIcon className="h-4 w-4" />
      <span>
        {article.published_at instanceof Date
          ? article.published_at.toLocaleDateString()
          : new Date(article.published_at || "").toLocaleDateString()}
      </span>
    </span>
    {article.author_name && (
      <span className="flex items-center space-x-1">
        <UserIcon className="h-4 w-4" />
        <span>{article.author_name}</span>
      </span>
    )}
  </div>
);
