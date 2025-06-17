import { Metadata } from 'next';
import ArticlesPageClient from '@/app/dashboard/articles/ArticlesPageClient';

export const metadata: Metadata = {
  title: 'Articles Management | NewsStudios',
  description: 'Manage and organize your articles, content, and media in one place',
  keywords: ['articles', 'content management', 'CMS', 'admin panel'],
  authors: [{ name: 'thang-truong' }],
};

export default function ArticlesPage() {
  return <ArticlesPageClient />;
}
