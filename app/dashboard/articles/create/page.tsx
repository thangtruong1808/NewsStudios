import { Metadata } from 'next';
import CreateArticlePageClient from './CreateArticlePageClient';

export const metadata: Metadata = {
  title: 'Create Article | NewsStudios',
  description: 'Create and manage your articles, content, and media in one place',
  keywords: ['articles', 'content management', 'CMS', 'admin panel'],
  authors: [{ name: 'thang-truong' }],
};

export default function CreateArticlePage() {
  return <CreateArticlePageClient />;
}
