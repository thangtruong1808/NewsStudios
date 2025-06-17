import { Metadata } from 'next';
import SubcategoriesPageClient from './SubcategoriesPageClient';

export const metadata: Metadata = {
  title: 'Subcategories Management | NewsStudios',
  description: 'Manage and organize your subcategories for better content organization',
  keywords: ['subcategories', 'content management', 'CMS', 'admin panel'],
  authors: [{ name: 'thang-truong' }],
};

export default function SubcategoriesPage() {
  return <SubcategoriesPageClient />;
}
