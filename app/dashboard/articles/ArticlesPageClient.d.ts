declare module '@/app/dashboard/articles/ArticlesPageClient' {
  interface ArticlesPageProps {
    searchParams?: {
      page?: string;
      search?: string;
      sortField?: string;
      sortDirection?: "asc" | "desc";
      query?: string;
      limit?: string;
    };
  }
  
  const ArticlesPageClient: React.FC<ArticlesPageProps>;
  export default ArticlesPageClient;
} 