import { Article } from "@/app/lib/definition";
import {
  CalendarIcon,
  UserIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface ArticleMetadataProps {
  article: Article;
}

export default function ArticleMetadata({ article }: ArticleMetadataProps) {
  return (
    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
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

      {article.category_name && (
        <Link
          href={`/explore?category=${article.category_name}`}
          className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
        >
          <FolderIcon className="h-4 w-4" />
          <span>
            <span className="font-medium">Category:</span>{" "}
            {article.category_name}
          </span>
        </Link>
      )}

      {article.subcategory_name && (
        <Link
          href={`/explore?subcategory=${article.subcategory_name}`}
          className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
        >
          <FolderIcon className="h-4 w-4" />
          <span>
            <span className="font-medium">Subcategory:</span>{" "}
            {article.subcategory_name}
          </span>
        </Link>
      )}
    </div>
  );
}
