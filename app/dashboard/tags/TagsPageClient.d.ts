declare module '@/app/dashboard/tags/TagsPageClient' {
  interface TagsPageClientProps {
    searchParams?: {
      page?: string;
      search?: string;
      sortField?: string;
      sortDirection?: "asc" | "desc";
      query?: string;
      limit?: string;
    };
  }

  const TagsPageClient: React.FC<TagsPageClientProps>;
  export default TagsPageClient;
} 