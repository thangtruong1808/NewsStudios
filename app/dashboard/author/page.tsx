import { Metadata } from 'next';
import AuthorsPageClient from './AuthorsPageClient';

export const metadata: Metadata = {
  title: 'Authors Management | NewsStudios',
  description: 'Manage and organize your authors, content creators, and contributors in one place',
  keywords: ['authors', 'content management', 'CMS', 'admin panel'],
  authors: [{ name: 'thang-truong' }],
};

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

export default function AuthorsPage({ searchParams }: AuthorsPageProps) {
  return <AuthorsPageClient searchParams={searchParams} />;
}
