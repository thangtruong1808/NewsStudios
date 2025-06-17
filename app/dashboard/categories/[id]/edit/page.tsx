import { Metadata } from 'next';
import EditCategoryPageClient from './EditCategoryPageClient';

export const metadata: Metadata = {
  title: 'Edit Category | NewsStudios',
  description: 'Edit category information and manage its content',
  keywords: ['categories', 'edit category', 'CMS', 'admin panel'],
  authors: [{ name: 'thang-truong' }],
};

export default function EditCategoryPage() {
  return <EditCategoryPageClient />;
}
