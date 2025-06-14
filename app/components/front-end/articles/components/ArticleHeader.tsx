import { Article } from "@/app/lib/definition";

interface ArticleHeaderProps {
  article: Article;
}

export default function ArticleHeader({ article }: ArticleHeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
        {article.title}
      </h1>
      {article.description && (
        <p className="text-lg text-gray-600 leading-relaxed">
          {article.description}
        </p>
      )}
    </header>
  );
}
