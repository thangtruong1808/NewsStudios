declare module '@/app/articles/[id]/ArticlePageClient' {
  interface ArticlePageClientProps {
    params: {
      id: string;
    };
  }

  const ArticlePageClient: React.FC<ArticlePageClientProps>;
  export default ArticlePageClient;
} 