declare module '@/app/articles/tag/[id]/TagArticlesClient' {
  interface TagArticlesClientProps {
    params: {
      id: string;
    };
  }

  const TagArticlesClient: React.FC<TagArticlesClientProps>;
  export default TagArticlesClient;
} 