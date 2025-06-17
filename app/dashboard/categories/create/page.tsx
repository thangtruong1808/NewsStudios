import { Metadata } from 'next';
import CreateCategoryPageClient from './CreateCategoryPageClient';

export const metadata: Metadata = {
  title: 'Create Category | NewsStudios',
  description: 'Create a new category to organize your content',
  keywords: ['categories', 'create category', 'CMS', 'admin panel'],
  authors: [{ name: 'thang-truong' }],
};

export default function CreateCategoryPage() {
  return <CreateCategoryPageClient />;
}
