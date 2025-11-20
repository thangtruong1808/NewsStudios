import Link from "next/link";
import { TagIcon } from "@heroicons/react/24/outline";

// Component Info
// Description: Display article tags with enhanced styling, hover effects, and visual hierarchy.
// Date updated: 2025-November-21
// Author: thangtruong

interface Tag {
  name: string;
  color: string;
  id: number;
}

interface ArticleTagsProps {
  tags: Tag[];
}

export default function ArticleTags({ tags }: ArticleTagsProps) {
  if (!tags.length) return null;

  return (
    <div className="mt-8 mb-6">
      {/* Tags section header */}
      <div className="flex items-center gap-2 mb-4">
        <TagIcon className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
      </div>
      {/* Tags container */}
      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <Link
            key={tag.id}
            href={`/articles/tag/${tag.id}`}
            className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-100"
            style={{
              backgroundColor: tag.color,
              color: "#ffffff",
            }}
          >
            <span className="text-xs opacity-90">#</span>
            <span className="whitespace-nowrap">{tag.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
