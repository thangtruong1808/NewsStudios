import Link from "next/link";

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
    <div className="flex flex-wrap gap-2 m-8">
      {tags.map((tag) => (
        <Link
          key={tag.id}
          href={`/articles/tag/${tag.id}`}
          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200"
          style={{
            backgroundColor: tag.color,
            color: '#ffffff'
          }}
        >
          #{tag.name}
        </Link>
      ))}
    </div>
  );
}
