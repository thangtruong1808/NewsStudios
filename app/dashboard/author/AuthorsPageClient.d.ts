declare module '@/app/dashboard/author/AuthorsPageClient' {
  interface AuthorsPageProps {
    searchParams: {
      page?: string;
      search?: string;
      sortField?: string;
      sortDirection?: "asc" | "desc";
      query?: string;
      limit?: string;
    };
  }

  const AuthorsPageClient: React.FC<AuthorsPageProps>;
  export default AuthorsPageClient;
} 