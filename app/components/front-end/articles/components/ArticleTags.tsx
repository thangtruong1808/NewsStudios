import Link from "next/link";

interface Tag {
  name: string;
  color: string;
}

interface ArticleTagsProps {
  tags: Tag[];
}

export default function ArticleTags({ tags }: ArticleTagsProps) {
  if (!tags.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {tags.map((tag) => (
        <Link
          key={tag.name}
          href={`/articles/tag/${tag.name}`}
          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200"
          style={{
            backgroundColor: `${tag.color}20`,
            color: tag.color,
          }}
        >
          #{tag.name}
        </Link>
      ))}
    </div>
  );
}
