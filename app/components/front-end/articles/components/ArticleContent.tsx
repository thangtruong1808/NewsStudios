interface ArticleContentProps {
  content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div className="prose prose-lg max-w-none mb-8">
      <div
        className="text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
