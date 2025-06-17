import { Metadata } from 'next';
import CategoriesPageClient from './CategoriesPageClient';

export const metadata: Metadata = {
  title: 'Categories Management | NewsStudios',
  description: 'Manage and organize your content categories and subcategories',
  keywords: ['categories', 'content management', 'CMS', 'admin panel'],
  authors: [{ name: 'thang-truong' }],
};

export default function CategoriesPage() {
  return <CategoriesPageClient />;
}
