import { FolderIcon, TagIcon } from "@heroicons/react/24/outline";
import { ArticleProps } from "./types";

export const ArticleMetadata = ({ article }: ArticleProps) => (
  <div className="flex items-center space-x-2">
    {article.category_name && (
      <span className="flex items-center px-2 py-1 bg-gray-100 rounded-full text-sm">
        <FolderIcon className="h-4 w-4 mr-1" />
        {article.category_name}
      </span>
    )}
    {article.subcategory_name && (
      <span className="flex items-center px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
        <TagIcon className="h-4 w-4 mr-1" />
        {article.subcategory_name}
      </span>
    )}
  </div>
);
